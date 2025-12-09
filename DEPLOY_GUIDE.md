# ⚠️ QUAN TRỌNG - Đọc kỹ trước khi deploy

## 🔐 BẢO MẬT API KEY

**KHÔNG BAO GIỜ** commit file `.env` lên Git!

### Làm gì nếu đã lộ API key?

1. **Vô hiệu hóa key cũ ngay:**

   -  Truy cập: https://aistudio.google.com/app/apikey
   -  Xóa API key đã bị lộ
   -  Tạo API key mới

2. **Xóa khỏi Git history:**

   ```bash
   # Nếu đã commit .env
   git rm --cached backend/.env
   git commit -m "Remove leaked API key"
   git push --force
   ```

3. **Đảm bảo .gitignore đúng:**
   ```
   # backend/.gitignore
   .env
   .env.local
   .env.*.local
   ```

---

## 🚀 DEPLOY LÊN VERCEL

### Option 1: Vercel CLI (Khuyến nghị)

#### Backend (API Routes):

```bash
cd backend

# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variable
vercel env add GEMINI_API_KEY production
# Paste your NEW API key

# Deploy to production
vercel --prod
```

#### Frontend:

```bash
cd EnglishV1

# Deploy
vercel

# Set backend URL (nếu cần)
vercel env add VITE_BACKEND_URL production
# Nhập URL của backend API

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard (Dễ hơn)

#### 1. Push code lên GitHub (KHÔNG có .env):

```bash
cd e:\EnglishV1

# Init git (nếu chưa có)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - without API keys"

# Add remote
git remote add origin https://github.com/congmanh2k4/EnglishV1.git

# Push
git push -u origin main
```

#### 2. Deploy Backend:

1. Vào https://vercel.com/new
2. Import repository: `congmanh2k4/EnglishV1`
3. **Root Directory:** `backend`
4. **Framework Preset:** Other
5. **Build Command:** `npm run build`
6. **Output Directory:** `dist`
7. **Environment Variables:**
   -  Key: `GEMINI_API_KEY`
   -  Value: `[YOUR_NEW_API_KEY]` ⚠️ Tạo key mới!
8. Click **Deploy**

#### 3. Deploy Frontend:

1. Import lại repository
2. **Root Directory:** `EnglishV1`
3. **Framework Preset:** Vite
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:**
   -  Key: `VITE_BACKEND_URL`
   -  Value: `https://your-backend.vercel.app`
7. Click **Deploy**

---

## 📝 Cấu trúc file cho Vercel

### Backend cần file `vercel.json`:

```json
{
   "version": 2,
   "builds": [
      {
         "src": "dist/server.js",
         "use": "@vercel/node"
      }
   ],
   "routes": [
      {
         "src": "/(.*)",
         "dest": "dist/server.js"
      }
   ]
}
```

---

## ✅ CHECKLIST trước khi push:

-  [ ] Đã xóa API key cũ trên Google Console
-  [ ] Đã tạo API key mới
-  [ ] File `.env` đã có trong `.gitignore`
-  [ ] Chạy `git status` - KHÔNG thấy `.env`
-  [ ] Đã test local với API key mới
-  [ ] Sẵn sàng set Environment Variables trên Vercel

---

## 🆘 Nếu cần help:

1. Check `.gitignore` hoạt động:

   ```bash
   git status
   # Không được thấy .env trong danh sách!
   ```

2. Nếu đã commit .env:

   ```bash
   git rm --cached backend/.env
   git commit -m "Remove .env from tracking"
   ```

3. Clean git history (nuclear option):
   ```bash
   # Cẩn thận! Sẽ mất history
   git filter-branch --force --index-filter \
   "git rm --cached --ignore-unmatch backend/.env" \
   --prune-empty --tag-name-filter cat -- --all
   ```

---

**QUAN TRỌNG:** Luôn dùng Environment Variables trên Vercel, không bao giờ commit API keys!
