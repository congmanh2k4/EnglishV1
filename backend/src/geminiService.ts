import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("Missing GEMINI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(apiKey);

// --- HELPER FUNCTION ---
/**
 * Cleans the raw string returned by the model to extract the JSON object.
 * @param rawString The raw string, which might contain a JSON block.
 * @returns A clean JSON string.
 */
const cleanJsonString = (rawString: string): string => {
  // Try to extract from markdown code block
  let match = rawString.match(/```json\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Try generic code block
  match = rawString.match(/```\n([\s\S]*?)\n```/);
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // Try to find JSON object directly
  match = rawString.match(/\{[\s\S]*\}/);
  if (match) {
    return match[0].trim();
  }
  
  return rawString.trim();
};


// --- TYPE DEFINITIONS ---
export type Difficulty = "Beginner" | "Intermediate" | "Advanced";

export interface Sentence {
  id: string;
  text: string;
  ipa: string;
  translation: string;
  note: string;
}

export interface PracticeSession {
  topic: string;
  scenario: string;
  sentences: Sentence[];
  difficulty: Difficulty;
}

export interface PronunciationFeedback {
  score: number;
  transcription: string;
  feedbackDetails: {
    accuracy: string;
    prosody: string;
    linking: string;
  };
  mistakes: Array<{
    word: string;
    suggestion: string;
  }>;
}


/**
 * Generates a practice session with sentences based on a topic and difficulty.
 */
export const generatePracticeSession = async (
  topic: string,
  difficulty: Difficulty = "Intermediate"
): Promise<PracticeSession> => {
  const modelId = "gemini-2.5-flash"; 

  const difficultyGuide = {
    Beginner: "Simple vocabulary, short sentences (5-8 words), focus on basic sentence stress.",
    Intermediate: "Moderate vocabulary, compound sentences, focus on linking sounds and intonation.",
    Advanced: "Advanced vocabulary, idioms, complex grammar, focus on natural native-like flow and nuance.",
  };

  const prompt = `You are a JSON API. Create a spoken English practice session.

Topic: "${topic}"
Level: ${difficulty} (${difficultyGuide[difficulty]})
User: Vietnamese learner practicing natural speaking

Generate exactly 5 sentences that flow naturally in a realistic scenario.

For EACH sentence provide:
- id: sequential number as string ("1", "2", etc.)
- text: the English sentence
- ipa: IPA phonetic transcription (use proper IPA symbols)
- translation: Vietnamese translation
- note: performance instruction (emotion, tone, stress)

Return ONLY a valid JSON object with this structure:
{
  "topic": "${topic}",
  "scenario": "One sentence describing the situation",
  "sentences": [
    {
      "id": "1",
      "text": "English sentence",
      "ipa": "IPA transcription",
      "translation": "Bản dịch tiếng Việt",
      "note": "Performance note"
    }
  ]
}

Output the JSON only. No markdown, no code blocks, no extra text.`;

  const model = genAI.getGenerativeModel({
    model: modelId
  });

  const result = await model.generateContent(prompt);

  const response = result.response;
  const text = response.text();
  
  if (!text) {
    throw new Error("Failed to generate session: No text in response");
  }

  try {
    const cleanedText = cleanJsonString(text);
    const data = JSON.parse(cleanedText) as PracticeSession;
    
    // Validate the response has required fields
    if (!data.sentences || !Array.isArray(data.sentences) || data.sentences.length === 0) {
      throw new Error("Invalid response: missing or empty sentences array");
    }
    
    // Validate each sentence has required fields
    for (const sentence of data.sentences) {
      if (!sentence.text || !sentence.ipa || !sentence.translation || !sentence.note) {
        throw new Error("Invalid response: sentence missing required fields");
      }
      // Ensure id exists
      if (!sentence.id) {
        sentence.id = String(data.sentences.indexOf(sentence) + 1);
      }
    }
    
    data.difficulty = difficulty;
    data.topic = topic; // Ensure topic is set
    
    return data;
  } catch (error) {
    console.error("Failed to parse practice session JSON:", error);
    console.error("Raw text from model:", text); // Log the raw text for debugging
    throw new Error("Failed to generate session: Invalid JSON response from AI");
  }
};

/**
 * Generates reference audio for a sentence.
 * NOTE: TTS has been moved to client-side using Web Speech API.
 * This function is kept for backward compatibility but will return a placeholder.
 */
export const generateReferenceAudio = async (text: string): Promise<string> => {
    // Return empty base64 - client will use Web Speech API instead
    console.log(`[TTS] Request for text: "${text}" - Using client-side TTS`);
    return "";
};

/**
 * Analyzes user pronunciation.
 */
export const analyzePronunciation = async (
  audioBase64: string,
  targetText: string
): Promise<PronunciationFeedback> => {
  const modelId = "gemini-2.5-flash"; 

  const prompt = `Pronunciation analysis API. Target: "${targetText}"

Analyze audio and output ONLY this JSON:
{
  "score": 85,
  "transcription": "what you heard",
  "feedbackDetails": {
    "accuracy": "Phát âm tổng thể: [tốt/khá/cần cải thiện]",
    "prosody": "Ngữ điệu: [tự nhiên/hơi cứng/cần luyện]",
    "linking": "Liên kết âm: [tốt/còn rời rạc]"
  },
  "mistakes": [{"word": "từ_sai", "suggestion": "Cách sửa"}]
}

Keep feedback concise. Vietnamese only. No markdown.`;

  const model = genAI.getGenerativeModel({
    model: modelId,
     safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ]
  });

  const audioPart = {
    inlineData: {
      data: audioBase64,
      mimeType: "audio/webm",
    },
  };

  const result = await model.generateContent([prompt, audioPart]);
  
  const response = result.response;
  const text = response.text();

  if (!text) {
    throw new Error("Failed to analyze audio: No text in response");
  }

  try {
    const cleanedText = cleanJsonString(text);
    const data = JSON.parse(cleanedText) as PronunciationFeedback;
    
    // Validate and provide defaults
    if (!data.feedbackDetails) {
      data.feedbackDetails = {
        accuracy: 'Chưa có đánh giá',
        prosody: 'Chưa có đánh giá',
        linking: 'Chưa có đánh giá'
      };
    }
    
    if (!data.mistakes) {
      data.mistakes = [];
    }
    
    if (typeof data.score !== 'number') {
      data.score = 70; // Default score
    }
    
    if (!data.transcription) {
      data.transcription = targetText;
    }
    
    console.log('[Pronunciation Analysis] Score:', data.score, 'Mistakes:', data.mistakes.length);
    
    return data;
  } catch (error) {
    console.error("Failed to parse pronunciation feedback JSON:", error);
    console.error("Raw text from model:", text); // Log the raw text for debugging
    throw new Error("Failed to analyze audio: Invalid JSON response from AI");
  }
};
