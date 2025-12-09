import React, { useState, useRef } from 'react';
import { AudioState } from '../types';

interface RecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  audioState: AudioState;
  setAudioState: (state: AudioState) => void;
}

export const Recorder: React.FC<RecorderProps> = ({ onRecordingComplete, audioState, setAudioState }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Prefer standard MIME types that Gemini accepts well
      let options = { mimeType: 'audio/webm;codecs=opus' };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          // Fallback
          options = { mimeType: 'audio/webm' }; 
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: options.mimeType });
        onRecordingComplete(blob);
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setAudioState(AudioState.RECORDING);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Please allow microphone access to practice.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setAudioState(AudioState.IDLE);
    }
  };

  const isRecording = audioState === AudioState.RECORDING;
  const isDisabled = audioState === AudioState.PLAYING_REF;

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isDisabled}
        className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
          isRecording 
            ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' 
            : 'bg-slate-700 hover:bg-slate-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isRecording ? (
          <div className="w-6 h-6 bg-white rounded-sm" />
        ) : (
          <div className="w-6 h-6 bg-red-400 rounded-full" />
        )}
      </button>
      <span className="text-xs font-medium text-slate-400">
        {isRecording ? "Stop" : "Record"}
      </span>
    </div>
  );
};
