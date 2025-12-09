# 🚨 CẢNH BÁO BẢO MẬT - HÀNH ĐỘNG NGAY!

## ⚠️ API Key đã bị lộ trên GitHub!

### ✅ CHECKLIST - Làm theo thứ tự:

#### 1. VÔ HIỆU HÓA KEY CŨ (5 phút)

-  [ ] Truy cập: https://aistudio.google.com/app/apikey
-  [ ] **XÓA** API key: `AIzaSyC-SDDmVxQRBhulYX7yQDL0bDzc77msTWQ`
-  [ ] Tạo API key **MỚI**
-  [ ] Lưu key mới vào `backend/.env` (local only)

#### 2. DỌN DẸP GIT (2 phút)

```powershell
# Chạy script check
.\check-deploy-ready.ps1

# Nếu đã commit .env, xóa khỏi git
git rm --cached backend/.env
git commit -m "Remove sensitive files"
```

#### 3. COMMIT AN TOÀN (1 phút)

```powershell
# Verify không có .env
git status  # KHÔNG được thấy .env!

# Commit code
git add .
git commit -m "Ready for deployment - no secrets"
git push origin main
```

#### 4. DEPLOY LÊN VERCEL (10 phút)

##### Deploy Backend:

1. Vào https://vercel.com/new
2. Import: `congmanh2k4/EnglishV1`
3. Settings:
   -  Root Directory: **`backend`**
   -  Build Command: `npm run build`
   -  Output Directory: `dist`
4. Environment Variables:
   -  `GEMINI_API_KEY` = `[YOUR_NEW_KEY_HERE]`
5. Deploy!

##### Deploy Frontend:

1. Import repository lại
2. Settings:
   -  Root Directory: **`EnglishV1`**
   -  Framework: Vite
   -  Build Command: `npm run build`
   -  Output Directory: `dist`
3. Environment Variables:
   -  `VITE_BACKEND_URL` = `https://your-backend-url.vercel.app`
4. Deploy!

---

## 📚 Chi tiết đầy đủ

Xem: [`DEPLOY_GUIDE.md`](DEPLOY_GUIDE.md)

---

## ❓ FAQ

**Q: Tại sao bị lộ?**
A: File `.env` đã được commit lên Git, nên API key public.

**Q: Có nguy hiểm không?**
A: Có! Người khác có thể dùng key → tốn tiền, quota của bạn.

**Q: Đã xóa file .env trên GitHub có đủ không?**
A: KHÔNG! Phải xóa key cũ và tạo key mới. Git history vẫn lưu key cũ.

**Q: Làm sao tránh lần sau?**
A:

-  Luôn check `.gitignore` trước
-  Chạy `.\check-deploy-ready.ps1` trước khi push
-  Dùng Environment Variables trên Vercel

---

## ✅ Done?

Sau khi làm xong, app sẽ:

-  ✅ Frontend: https://your-app.vercel.app
-  ✅ Backend: https://your-api.vercel.app
-  ✅ API key an toàn trong Vercel Environment Variables
-  ✅ Không còn secrets trong Git

**Cần help? Ping me!** 🚀
