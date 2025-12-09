import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { generatePracticeSession, generateReferenceAudio, analyzePronunciation } from './geminiService';

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage() });

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('EnglishV1 Backend is running!');
});

app.post('/api/generate-session', async (req, res) => {
  try {
    const { topic, difficulty } = req.body;
    console.log(`[API] Generate session request: topic="${topic}", difficulty="${difficulty}"`);
    
    if (!topic || !difficulty) {
      return res.status(400).json({ error: 'Missing topic or difficulty' });
    }
    
    const session = await generatePracticeSession(topic, difficulty);
    console.log(`[API] Session generated successfully with ${session.sentences?.length || 0} sentences`);
    
    res.json(session);
  } catch (error: any) {
    console.error('Error in /api/generate-session:', error);
    res.status(500).json({ error: error.message || 'Failed to generate practice session' });
  }
});

app.post('/api/generate-audio', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }
    const audioBase64 = await generateReferenceAudio(text);
    res.json({ audioBase64 });
  } catch (error) {
    console.error('Error in /api/generate-audio:', error);
    res.status(500).json({ error: 'Failed to generate audio' });
  }
});

app.post('/api/analyze-pronunciation', upload.single('audio'), async (req, res) => {
  try {
    const { targetText } = req.body;
    if (!req.file || !targetText) {
      return res.status(400).json({ error: 'Missing audio file or target text' });
    }
    const audioBase64 = req.file.buffer.toString('base64');
    const feedback = await analyzePronunciation(audioBase64, targetText);
    res.json(feedback);
  } catch (error) {
    console.error('Error in /api/analyze-pronunciation:', error);
    res.status(500).json({ error: 'Failed to analyze pronunciation' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server is listening on port ${port}`);
});
