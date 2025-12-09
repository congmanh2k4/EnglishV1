import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  text: string; // Changed from audioBuffer to text for TTS
  onPlayStart: () => void;
  onPlayEnd: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ text, onPlayStart, onPlayEnd }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      console.error('Web Speech API is not supported in this browser');
      return;
    }

    // Load voices (some browsers load voices asynchronously)
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        console.log('Available voices:', voices.map(v => `${v.name} (${v.lang})`));
      }
    };

    // Initial load
    loadVoices();

    // Some browsers fire this event when voices are loaded
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      // Cleanup
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const playAudio = async () => {
    if (!text || !isSupported) return;

    try {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Configure voice settings
      utterance.lang = 'en-US'; // US English
      utterance.rate = 0.9; // Slightly slower for learning
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to get a native English voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en-') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en-'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        onPlayStart();
      };

      utterance.onend = () => {
        setIsPlaying(false);
        onPlayEnd();
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsPlaying(false);
        onPlayEnd();
      };

      window.speechSynthesis.speak(utterance);

    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      onPlayEnd();
    }
  };

  return (
    <button
      onClick={playAudio}
      disabled={!text || isPlaying || !isSupported}
      className={`p-3 rounded-full transition-all ${
        isPlaying 
          ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
          : 'bg-slate-700 text-blue-300 hover:bg-slate-600 hover:text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={isSupported ? "Listen to native pronunciation" : "Text-to-speech not supported"}
    >
      {isPlaying ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      )}
    </button>
  );
};