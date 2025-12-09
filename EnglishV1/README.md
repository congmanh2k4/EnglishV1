# 🎯 Gemini Pro-nounce - AI English Pronunciation Trainer

Ứng dụng luyện phát âm tiếng Anh thông minh sử dụng Gemini AI để tạo bài học tùy chỉnh, phản hồi chi tiết về phát âm, ngữ điệu và liên kết âm.

## ✨ Tính năng chính

-  🎓 **Structured Learning Path**: 15+ bài học được thiết kế theo 4 chủ đề (Giao tiếp hàng ngày, Du lịch, Công sở, IELTS)
-  🎨 **Custom Practice Mode**: Tạo bài luyện tập theo chủ đề bất kỳ với 3 độ khó
-  🎤 **Real-time Audio Recording**: Thu âm và phân tích phát âm
-  🔊 **Native Reference Audio**: Âm thanh tham chiếu từ Gemini TTS
-  📊 **Detailed Feedback**: Đánh giá chi tiết về pronunciation, prosody, và linking
-  📈 **Progressive Learning**: Tự động chuyển sang bài học tiếp theo

## 🚀 Cài đặt & Chạy

### Prerequisites

-  Node.js 18+
-  npm hoặc yarn
-  Gemini API key ([lấy tại đây](https://aistudio.google.com/app/apikey))

### 1. Frontend Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

### 2. Backend Setup

Xem hướng dẫn chi tiết tại [`backend/README.md`](../backend/README.md)

```bash
cd ../backend

# Install dependencies
npm install

# Setup .env file
cp .env.example .env
# Sau đó thêm GEMINI_API_KEY vào file .env

# Run server
npm run dev
```

Backend sẽ chạy tại: http://localhost:3001

## 🏗️ Cấu trúc Project

```
EnglishV1/
├── components/          # React components
│   ├── AudioPlayer.tsx  # Audio playback
│   ├── Recorder.tsx     # Audio recording
│   ├── FeedbackCard.tsx # Pronunciation feedback display
│   ├── TopicInput.tsx   # Custom topic input
│   └── CourseSelector.tsx # Structured course selector
├── services/            # API services
│   └── geminiService.ts # Backend API calls
├── data/
│   └── curriculum.ts    # Learning path structure
├── App.tsx              # Main app component
└── types.ts             # TypeScript types
```

## 🔧 Tech Stack

**Frontend:**

-  React 19 + TypeScript
-  Vite
-  Tailwind CSS
-  Web Audio API

**Backend:**

-  Express.js + TypeScript
-  Google Gemini AI (gemini-2.5-flash, tts-1)
-  Multer (file upload)

## 📝 Sử dụng

1. **Chọn mode luyện tập**: Courses (có cấu trúc) hoặc Custom (tự do)
2. **Chọn bài học** hoặc nhập topic tùy chỉnh
3. **Nghe** audio tham chiếu
4. **Thu âm** phát âm của bạn
5. **Nhận phản hồi** chi tiết từ AI
6. **Retry** hoặc chuyển sang câu tiếp theo

## ⚠️ Lưu ý

-  Cần kết nối internet để sử dụng Gemini AI
-  Cần cho phép truy cập microphone
-  API key phải được cấu hình đúng trong backend
