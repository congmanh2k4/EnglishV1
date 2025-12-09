# 🎯 Gemini Pro-nounce

**AI-Powered English Pronunciation Trainer**

Ứng dụng luyện phát âm tiếng Anh thông minh sử dụng Google Gemini AI để tạo bài học tùy chỉnh, cung cấp audio tham chiếu và phân tích phát âm chi tiết.

---

## 📋 Tổng quan

Project này bao gồm 2 phần:

-  **Frontend** (`EnglishV1/`): React + TypeScript + Vite + Tailwind CSS
-  **Backend** (`backend/`): Express + TypeScript + Gemini AI

## ✨ Tính năng

✅ **Structured Learning Path** - 15+ bài học theo 4 categories  
✅ **Custom Practice Mode** - Tạo bài luyện theo topic bất kỳ  
✅ **AI-Generated Sessions** - Gemini tạo câu + IPA + translation  
✅ **Native TTS Audio** - Âm thanh tham chiếu chuẩn  
✅ **Real-time Recording** - Thu âm trực tiếp từ microphone  
✅ **Smart Pronunciation Analysis** - AI đánh giá chi tiết  
✅ **Progressive Learning** - Tự động chuyển bài tiếp theo

---

## 🚀 Quick Start

### 1️⃣ Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Thêm GEMINI_API_KEY vào file .env
npm run dev
```

Backend → http://localhost:3001

### 2️⃣ Setup Frontend

```bash
cd EnglishV1
npm install
npm run dev
```

Frontend → http://localhost:5173

📖 **Chi tiết:** Xem README.md trong từng folder

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Frontend      │ ◄──────►│   Backend        │
│   React + TS    │  HTTP   │   Express + TS   │
└─────────────────┘         └──────────────────┘
        ▲                            ▲
        │                            │
        │                     ┌──────▼─────────┐
        │                     │  Gemini AI     │
        │                     │  - Text Gen    │
        └─────────────────────│  - TTS         │
           Web Audio API      │  - STT + NLP   │
                              └────────────────┘
```

---

## 🔐 Security Improvements (Đã thực hiện)

✅ Thêm `.gitignore` cho backend để bảo vệ `.env`  
✅ Tạo `.env.example` template  
✅ Update `multer` lên v2.0.2 (fix security vulnerabilities)  
✅ Thêm timeout cho tất cả API calls (30-45s)  
✅ Cải thiện error handling với messages chi tiết  
✅ Validate audio data trước khi process

---

## 📊 Project Status

**Chức năng:** ✅ Hoàn thiện  
**Logic flow:** ✅ Đúng  
**Error handling:** ✅ Đã cải thiện  
**Security:** ✅ Đã fix các vấn đề quan trọng  
**Documentation:** ✅ Đầy đủ

**Production Ready:** ⚠️ Cần thêm:

-  Unit tests
-  E2E tests
-  Performance optimization (caching)
-  Rate limiting cho API
-  Database cho user progress tracking

---

## 🛠️ Tech Stack

| Layer    | Technologies                             |
| -------- | ---------------------------------------- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend  | Express, TypeScript, Multer              |
| AI/ML    | Google Gemini 2.5 Flash, TTS-1           |
| Audio    | Web Audio API, MediaRecorder API         |

---

## 📝 API Documentation

### Backend Endpoints

**POST** `/api/generate-session`  
Tạo practice session với topic + difficulty

**POST** `/api/generate-audio`  
Generate TTS audio từ text

**POST** `/api/analyze-pronunciation`  
Phân tích pronunciation từ audio recording

👉 Xem chi tiết: [`backend/README.md`](backend/README.md)

---

## 🎓 Learning Path

### 📚 Categories

1. **Giao tiếp Hàng ngày** (4 lessons)
2. **Du lịch & Khám phá** (4 lessons)
3. **Tiếng Anh Công sở** (4 lessons)
4. **Luyện thi IELTS** (3 lessons)

---

## 🤝 Contributing

Nếu muốn đóng góp:

1. Fork repo
2. Create feature branch
3. Commit changes
4. Push và tạo Pull Request

---

## ⚠️ Important Notes

-  ⚠️ **KHÔNG** commit file `.env` lên Git
-  🔑 Gemini API key là thông tin nhạy cảm
-  🌐 Cần kết nối internet để sử dụng
-  🎤 Cần cho phép microphone access

---

## 📄 License

MIT License - Tự do sử dụng và chỉnh sửa

---

## 👨‍💻 Author

Created by congmanh2k4

**Repository:** https://github.com/congmanh2k4/EnglishV1

---

## 🆘 Troubleshooting

**Backend không chạy?**

-  Kiểm tra `GEMINI_API_KEY` trong `.env`
-  Đảm bảo port 3001 không bị chiếm

**Frontend không kết nối được backend?**

-  Kiểm tra backend đang chạy tại port 3001
-  Xem console log để biết error message

**Microphone không hoạt động?**

-  Cho phép browser truy cập microphone
-  Thử refresh trang

**Audio không play?**

-  Kiểm tra backend logs
-  Đảm bảo Gemini API key hợp lệ
