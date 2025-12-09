import React, { useState, useEffect } from 'react';
import { TopicInput } from './components/TopicInput';
import { CourseSelector } from './components/CourseSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { Recorder } from './components/Recorder';
import { FeedbackCard } from './components/FeedbackCard';
import { generatePracticeSession, analyzePronunciation, isBackendConfigured } from './services/geminiService';
import { AppState, AudioState, PracticeSession, PronunciationFeedback, Difficulty, Lesson, Category } from './types';
import { CURRICULUM } from './data/curriculum';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioState, setAudioState] = useState<AudioState>(AudioState.IDLE);
  const [feedback, setFeedback] = useState<PronunciationFeedback | null>(null);
  const [backendOffline, setBackendOffline] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [analyzingTip, setAnalyzingTip] = useState<string>('');
  const [userRecordingBlob, setUserRecordingBlob] = useState<Blob | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState<'courses' | 'custom'>('courses');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);

  // Tips to show while analyzing
  const analyzingTips = [
    "💡 Focus on word stress - it's key to natural English!",
    "💡 Practice linking words together smoothly",
    "💡 Listen to native speakers daily for better accent",
    "💡 Record yourself to track improvement over time",
    "💡 Shadowing technique: repeat right after native audio",
    "💡 Stress the important words in each sentence",
    "💡 Don't rush - clear pronunciation > speed"
  ];

  const handleGenerateSession = async (topic: string, difficulty: Difficulty) => {
    const backendOnline = await isBackendConfigured();
    if (!backendOnline) {
      setBackendOffline(true);
      return;
    }
    setBackendOffline(false);
    setErrorMessage('');
    setAppState(AppState.GENERATING_SESSION);
    try {
      const newSession = await generatePracticeSession(topic, difficulty);
      
      // Validate session data
      if (!newSession || !newSession.sentences || newSession.sentences.length === 0) {
        throw new Error("Invalid session data received. Please try again.");
      }
      
      console.log('Session loaded:', newSession);
      setSession(newSession);
      setCurrentIndex(0);
      setAppState(AppState.PRACTICING);
      setFeedback(null);
    } catch (error: any) {
      console.error('Session generation error:', error);
      const message = error.message || "Error generating session. Please check your connection and try again.";
      setErrorMessage(message);
      setAppState(AppState.IDLE);
    }
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // For lessons, we default to Intermediate, or we could add a selector in the course view too.
    // For now, let's use Intermediate as a balanced default for structured lessons.
    handleGenerateSession(lesson.queryTopic, 'Intermediate');
  };

  const findNextLesson = (currentId: string): Lesson | null => {
    for (const category of CURRICULUM) {
      const idx = category.lessons.findIndex(l => l.id === currentId);
      if (idx !== -1 && idx < category.lessons.length - 1) {
        return category.lessons[idx + 1];
      }
    }
    return null;
  };

  const handleRecordingComplete = async (blob: Blob) => {
    if (!session) return;
    
    // Save the recording blob for replay
    setUserRecordingBlob(blob);
    
    setAppState(AppState.ANALYZING);
    setErrorMessage('');
    
    // Show random tip while analyzing
    const randomTip = analyzingTips[Math.floor(Math.random() * analyzingTips.length)];
    setAnalyzingTip(randomTip);
    
    try {
      // The service now handles the blob directly
      const result = await analyzePronunciation(blob, session.sentences[currentIndex].text);
      setFeedback(result);
    } catch (error: any) {
      console.error(error);
      const message = error.message || "Error analyzing audio. Please try recording again.";
      setErrorMessage(message);
    } finally {
      setAppState(AppState.PRACTICING);
    }
  };

  const handlePlayUserRecording = () => {
    if (!userRecordingBlob) return;
    
    setIsPlayingUserAudio(true);
    const audioUrl = URL.createObjectURL(userRecordingBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      setIsPlayingUserAudio(false);
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.onerror = () => {
      setIsPlayingUserAudio(false);
      URL.revokeObjectURL(audioUrl);
    };
    
    audio.play();
  };

  const handleNext = () => {
    if (session && currentIndex < session.sentences.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setFeedback(null);
      setUserRecordingBlob(null); // Clear recording when moving to next
    } else {
      setAppState(AppState.SESSION_COMPLETE);
    }
  };

  const handleRetry = () => {
    setFeedback(null);
    setUserRecordingBlob(null); // Clear recording for retry
  };

  const handleFinishSession = () => {
    setAppState(AppState.IDLE);
    setSession(null);
    setFeedback(null);
    setCurrentLesson(null);
  };

  const handleStartNextLesson = () => {
    if (currentLesson) {
      const next = findNextLesson(currentLesson.id);
      if (next) {
        handleSelectLesson(next);
      } else {
        handleFinishSession();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center">
      <header className="w-full py-4 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setAppState(AppState.IDLE)}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              P
            </div>
            <h1 className="text-lg font-bold tracking-tight hidden sm:block">Gemini <span className="text-blue-400 font-light">Pro-nounce</span></h1>
          </div>
          
          {appState === AppState.IDLE && (
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('courses')}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'courses' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Courses
              </button>
              <button 
                 onClick={() => setActiveTab('custom')}
                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'custom' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
              >
                Custom
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="w-full max-w-4xl px-4 py-8 flex-1">
        
        {appState === AppState.IDLE && (
          <div className="animate-fade-in mt-6">
             {backendOffline && (
               <div className="mb-4 px-4 py-3 rounded-lg border border-amber-500/50 bg-amber-500/10 text-amber-200 text-sm">
                 Không thể kết nối đến máy chủ backend. Hãy chắc chắn rằng bạn đã chạy <code>npm run dev</code> trong thư mục <code>backend</code>.
               </div>
             )}
             {errorMessage && (
               <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-200 text-sm flex items-start gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                 <span>{errorMessage}</span>
               </div>
             )}
             <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                {activeTab === 'courses' ? 'Structured Learning Path' : 'Practice Anything'}
              </h2>
              <p className="text-slate-400">
                {activeTab === 'courses' 
                  ? 'Follow a curated curriculum designed to improve specific skills.' 
                  : 'Generate a unique lesson based on any topic you provide.'}
              </p>
            </div>

            {activeTab === 'courses' ? (
              <CourseSelector onSelectLesson={handleSelectLesson} isLoading={false} />
            ) : (
              <TopicInput onGenerate={handleGenerateSession} isLoading={false} />
            )}
          </div>
        )}

        {appState === AppState.GENERATING_SESSION && (
          <div className="flex flex-col items-center justify-center h-64 animate-pulse">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
            <p className="text-lg text-blue-300">Designing your session...</p>
            <p className="text-sm text-slate-500 mt-2">Creating context, sentences & translations</p>
          </div>
        )}

        {/* PRACTICE UI */}
        {(appState === AppState.PRACTICING || appState === AppState.ANALYZING) && session && session.sentences && session.sentences[currentIndex] && (
          <div className="max-w-2xl mx-auto animate-fade-in">
            {/* Header / Progress */}
            <div className="flex items-center justify-between mb-6 text-sm text-slate-500">
              <button onClick={() => setAppState(AppState.IDLE)} className="hover:text-slate-300 transition-colors flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                Exit
              </button>
              <div className="flex gap-1">
                 {session.sentences.map((_, idx) => (
                   <div key={idx} className={`h-1.5 w-6 rounded-full ${idx <= currentIndex ? 'bg-blue-500' : 'bg-slate-800'}`}></div>
                 ))}
              </div>
            </div>

            {/* Context Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              
              <div className="mb-6">
                 <div className="flex items-start justify-between">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-800 text-xs font-semibold text-blue-400 mb-3 border border-slate-700">
                      {session.topic || 'Practice Session'}
                    </span>
                    {session.difficulty && (
                      <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">{session.difficulty}</span>
                    )}
                 </div>
                 <p className="text-slate-400 text-sm mb-4 italic border-l-2 border-slate-700 pl-4">
                   Context: {session.sentences[currentIndex].note || 'Practice speaking naturally'}
                 </p>
              </div>

              {/* Main Sentence */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 leading-relaxed">
                  {session.sentences[currentIndex].text || 'Loading...'}
                </h2>
                <div className="text-slate-500 font-mono text-sm mb-2 opacity-75">
                  {session.sentences[currentIndex].ipa && `/${session.sentences[currentIndex].ipa}/`}
                </div>
                <div className="text-blue-300/80 text-lg">
                  {session.sentences[currentIndex].translation || ''}
                </div>
              </div>

              {/* Error Display */}
              {errorMessage && (
                <div className="mb-4 px-4 py-3 rounded-lg border border-red-500/50 bg-red-500/10 text-red-200 text-sm flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Controls */}
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <AudioPlayer 
                      text={session.sentences[currentIndex].text}
                      onPlayStart={() => setAudioState(AudioState.PLAYING_REF)}
                      onPlayEnd={() => setAudioState(AudioState.IDLE)}
                    />
                    <span className="text-xs font-medium text-slate-500">Listen</span>
                  </div>

                  <Recorder 
                    onRecordingComplete={handleRecordingComplete}
                    audioState={audioState}
                    setAudioState={setAudioState}
                  />
                </div>
              </div>
              
              {appState === AppState.ANALYZING && (
                 <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="text-center max-w-md px-6">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full mx-auto"></div>
                        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto absolute top-0 left-1/2 -translate-x-1/2"></div>
                      </div>
                      <p className="text-purple-300 font-bold text-lg mb-2">🎧 Đang phân tích phát âm...</p>
                      <p className="text-slate-400 text-sm mb-4">AI đang xử lý audio của bạn</p>
                      
                      <div className="bg-slate-800/50 border border-purple-500/30 rounded-lg p-4 mb-4">
                        <p className="text-sm text-slate-300">{analyzingTip}</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                      <p className="text-slate-500 text-xs italic">⏱️ Thời gian xử lý: 10-20 giây</p>
                    </div>
                 </div>
              )}
            </div>

            {/* Feedback Section */}
            {feedback && (
              <FeedbackCard 
                feedback={feedback} 
                onRetry={handleRetry} 
                onNext={handleNext}
                isLast={currentIndex === session.sentences.length - 1}
                onPlayUserRecording={handlePlayUserRecording}
                hasUserRecording={!!userRecordingBlob}
                isPlayingUserAudio={isPlayingUserAudio}
              />
            )}
          </div>
        )}

        {appState === AppState.SESSION_COMPLETE && (
          <div className="max-w-lg mx-auto text-center animate-fade-in py-12">
            <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
            <p className="text-slate-400 mb-8">You've finished practicing "{session?.topic}". Great job working on your intonation and flow.</p>
            
            <div className="flex flex-col gap-3">
              {currentLesson && findNextLesson(currentLesson.id) && (
                 <button 
                  onClick={handleStartNextLesson}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Start Next Lesson: {findNextLesson(currentLesson.id)?.title} →
                </button>
              )}

              <button 
                onClick={handleFinishSession}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;