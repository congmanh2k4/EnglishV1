import React from 'react';
import { PronunciationFeedback } from '../types';

interface FeedbackCardProps {
  feedback: PronunciationFeedback;
  onRetry: () => void;
  onNext: () => void;
  isLast: boolean;
  onPlayUserRecording?: () => void;
  hasUserRecording?: boolean;
  isPlayingUserAudio?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ 
  feedback, 
  onRetry, 
  onNext, 
  isLast,
  onPlayUserRecording,
  hasUserRecording = false,
  isPlayingUserAudio = false
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Safe fallbacks for potentially undefined fields
  const feedbackDetails = feedback?.feedbackDetails || {
    accuracy: 'No feedback available',
    prosody: 'No feedback available',
    linking: 'No feedback available'
  };

  return (
    <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">Feedback</h3>
          <p className="text-sm text-slate-400">Analysis complete</p>
        </div>
        <div className="text-center">
          <div className={`text-3xl font-bold ${getScoreColor(feedback?.score || 0)}`}>
            {feedback?.score || 0}
          </div>
          <span className="text-xs text-slate-500 uppercase tracking-wide">Score</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-blue-400 text-xs font-bold uppercase mb-1">Transcription</div>
          <p className="text-slate-200 italic">"{feedback?.transcription || 'No transcription available'}"</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-purple-400 text-xs font-bold uppercase mb-1">Rhythm & Tone</div>
          <p className="text-slate-300 text-sm">{feedbackDetails.prosody}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg">
          <div className="text-orange-400 text-xs font-bold uppercase mb-1">Linking</div>
          <p className="text-slate-300 text-sm">{feedbackDetails.linking}</p>
        </div>
      </div>

      {feedback?.mistakes && feedback.mistakes.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-slate-400 uppercase mb-3">Fix these words</h4>
          <div className="space-y-2">
            {feedback.mistakes.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-red-900/20 p-3 rounded border border-red-900/50">
                <span className="font-bold text-red-400 min-w-[80px]">{m.word}</span>
                <span className="text-slate-300 text-sm">→ {m.suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Replay User Recording Button */}
      {hasUserRecording && onPlayUserRecording && (
        <div className="mb-4 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" x2="12" y1="19" y2="22"></line></svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-300">Phát âm của bạn</p>
                <p className="text-xs text-slate-400">Nghe lại để so sánh</p>
              </div>
            </div>
            <button
              onClick={onPlayUserRecording}
              disabled={isPlayingUserAudio}
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                isPlayingUserAudio 
                  ? 'bg-blue-600 text-white cursor-wait' 
                  : 'bg-blue-500 hover:bg-blue-400 text-white'
              }`}
            >
              {isPlayingUserAudio ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Playing...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  Nghe lại
                </>
              )}
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4 mt-6">
        <button
          onClick={onRetry}
          className="flex-1 py-2 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
        >
          Try Again
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
        >
          {isLast ? "Finish Session" : "Next Sentence"}
        </button>
      </div>
    </div>
  );
};
