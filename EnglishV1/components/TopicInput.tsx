import React, { useState } from 'react';
import { Difficulty } from '../types';

interface TopicInputProps {
  onGenerate: (topic: string, difficulty: Difficulty) => void;
  isLoading: boolean;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onGenerate, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Intermediate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) onGenerate(topic, difficulty);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-slate-900 rounded-xl shadow-lg border border-slate-800 animate-fade-in">
      <h2 className="text-2xl font-bold mb-2 text-center text-blue-400">Custom Practice</h2>
      <p className="text-slate-400 text-center mb-6 text-sm">
        Enter any topic, situation, or specific phrase you want to master.
      </p>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Explaining technical debt to a manager..."
            className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 font-medium">Level:</span>
            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
              {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    difficulty === level 
                      ? 'bg-slate-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !topic.trim()}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating Session...</span>
              </div>
            ) : (
              <span>Create Practice Session</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};