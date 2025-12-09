import { PracticeSession, PronunciationFeedback, Difficulty } from "../types";

// Use environment variable for backend URL, fallback to localhost for development
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const REQUEST_TIMEOUT = 30000; // 30 seconds

/**
 * Wrapper for fetch with timeout
 */
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeout = REQUEST_TIMEOUT): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - server took too long to respond');
    }
    throw error;
  }
};

/**
 * Checks if the backend server is running.
 */
export const isBackendConfigured = async () => {
  try {
    const response = await fetchWithTimeout(backendUrl, {}, 5000);
    return response.ok;
  } catch (error) {
    console.error("Backend not reachable:", error);
    return false;
  }
};


/**
 * Generates a practice session by fetching from the backend.
 */
export const generatePracticeSession = async (
  topic: string,
  difficulty: Difficulty = "Intermediate"
): Promise<PracticeSession> => {
  const response = await fetchWithTimeout(`${backendUrl}/api/generate-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, difficulty }),
  });

  if (!response.ok) {
    let errorMessage = "Failed to generate session from backend";
    try {
      const err = await response.json();
      errorMessage = err.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Generates reference audio using Web Speech API (client-side TTS).
 * This is a more efficient approach that doesn't require backend processing.
 */
export const generateReferenceAudio = async (text: string): Promise<ArrayBuffer | null> => {
  // Web Speech API will be used directly in the AudioPlayer component
  // This function returns null to indicate client-side TTS should be used
  return null;
};

/**
 * Analyzes user pronunciation by sending audio to the backend.
 * NOTE: The App.tsx will now need to send the raw 'Blob' object.
 */
export const analyzePronunciation = async (
  audioBlob: Blob,
  targetText: string
): Promise<PronunciationFeedback> => {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error("No audio recorded. Please try recording again.");
  }

  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('targetText', targetText);

  const response = await fetchWithTimeout(`${backendUrl}/api/analyze-pronunciation`, {
    method: 'POST',
    body: formData, // No 'Content-Type' header needed, browser sets it for FormData
  }, 45000); // Longer timeout for audio analysis

  if (!response.ok) {
    let errorMessage = "Failed to analyze pronunciation from backend";
    try {
      const err = await response.json();
      errorMessage = err.error || errorMessage;
    } catch {
      // If response is not JSON, use default message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
