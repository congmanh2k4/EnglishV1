export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Sentence {
  id: string;
  text: string;
  ipa: string;
  translation: string; // Vietnamese translation
  note: string; // Brief note on context or emotion
}

export interface PracticeSession {
  topic: string;
  scenario: string;
  sentences: Sentence[];
  difficulty?: Difficulty;
}

export interface PronunciationFeedback {
  score: number; // 0-100
  transcription: string; // What the AI heard
  feedbackDetails: {
    accuracy: string; // General feedback on accuracy
    prosody: string; // Feedback on rhythm and intonation
    linking: string; // Feedback on connected speech
  };
  mistakes: Array<{
    word: string;
    suggestion: string;
  }>;
}

// New types for structured curriculum
export interface Lesson {
  id: string;
  title: string;
  description: string;
  queryTopic: string; // The topic string sent to Gemini
}

export interface Category {
  id: string;
  title: string;
  description: string;
  icon: string; // Emoji
  lessons: Lesson[];
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING_SESSION = 'GENERATING_SESSION',
  PRACTICING = 'PRACTICING',
  ANALYZING = 'ANALYZING',
  SESSION_COMPLETE = 'SESSION_COMPLETE', // New state for finishing a lesson
}

export enum AudioState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
  PLAYING_REF = 'PLAYING_REF',
}