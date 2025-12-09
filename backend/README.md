# EnglishV1 Backend

Backend server cho ứng dụng luyện phát âm tiếng Anh sử dụng Gemini AI.

## 🚀 Cài đặt

### 1. Install dependencies

```bash
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Sau đó mở file `.env` và thêm Gemini API key của bạn:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

**Lấy API key tại:** https://aistudio.google.com/app/apikey

### 3. Build TypeScript

```bash
npm run build
```

### 4. Chạy server

```bash
npm run dev
```

Server sẽ chạy tại: http://localhost:3001

## 📡 API Endpoints

### GET `/`

Health check endpoint

### POST `/api/generate-session`

Tạo practice session với các câu để luyện tập

**Request Body:**

```json
{
   "topic": "Ordering coffee at a cafe",
   "difficulty": "Intermediate"
}
```

### POST `/api/generate-audio`

Tạo audio tham chiếu từ text

**Request Body:**

```json
{
   "text": "Hello, how are you today?"
}
```

**Response:**

```json
{
   "audioBase64": "base64_encoded_audio_data"
}
```

### POST `/api/analyze-pronunciation`

Phân tích phát âm của người dùng

**Request:** multipart/form-data

-  `audio`: Audio file (webm)
-  `targetText`: Text người dùng cần phát âm

**Response:**

```json
{
   "score": 85,
   "transcription": "hello how are you today",
   "feedbackDetails": {
      "accuracy": "Good pronunciation overall",
      "prosody": "Natural intonation",
      "linking": "Good word connections"
   },
   "mistakes": []
}
```

## 🔧 Scripts

-  `npm run build` - Build TypeScript thành JavaScript
-  `npm run dev` - Build và chạy server
-  `npm start` - Chạy server đã build (production)

## ⚠️ Lưu ý bảo mật

-  **KHÔNG BAO GIỜ** commit file `.env` lên Git
-  File `.env` đã được thêm vào `.gitignore`
-  Chỉ share `.env.example` file
