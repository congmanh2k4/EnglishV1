# Script để check trước khi deploy lên Vercel

Write-Host "🚀 Kiểm tra sẵn sàng deploy lên Vercel..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists in backend
if (Test-Path "backend\.env") {
    Write-Host "⚠️  CẢNH BÁO: backend\.env tồn tại!" -ForegroundColor Yellow
    Write-Host "   File này KHÔNG được commit lên Git" -ForegroundColor Yellow
    Write-Host "   Đảm bảo nó có trong .gitignore" -ForegroundColor Yellow
    Write-Host ""
}

# Check if .gitignore includes .env
$gitignoreContent = Get-Content "backend\.gitignore" -Raw
if ($gitignoreContent -match "\.env") {
    Write-Host "✅ backend\.gitignore đã include .env" -ForegroundColor Green
} else {
    Write-Host "❌ backend\.gitignore CHƯA include .env" -ForegroundColor Red
    Write-Host "   Thêm '.env' vào backend\.gitignore" -ForegroundColor Red
    exit 1
}

# Check git status
Write-Host ""
Write-Host "📋 Kiểm tra git status..." -ForegroundColor Cyan

if (Test-Path ".git") {
    $trackedFiles = git ls-files
    if ($trackedFiles -match "\.env") {
        Write-Host "❌ LỖI: File .env đang được track trong git!" -ForegroundColor Red
        Write-Host "   Chạy: git rm --cached backend\.env" -ForegroundColor Yellow
        Write-Host "   Sau đó: git commit -m 'Remove .env from tracking'" -ForegroundColor Yellow
        exit 1
    } else {
        Write-Host "✅ Không có file .env nào được track trong git" -ForegroundColor Green
    }
} else {
    Write-Host "⚠️  Chưa init git repository" -ForegroundColor Yellow
    Write-Host "   Chạy: git init" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Tất cả kiểm tra đã pass!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Các bước tiếp theo:" -ForegroundColor Cyan
Write-Host "1. ⚠️  XÓA API key cũ đã bị lộ tại: https://aistudio.google.com/app/apikey" -ForegroundColor Yellow
Write-Host "2. 🔑 Tạo API key MỚI" -ForegroundColor White
Write-Host "3. 🚀 Deploy lên Vercel và set GEMINI_API_KEY trong Environment Variables" -ForegroundColor White
Write-Host ""
Write-Host "Sẵn sàng deploy! 🎉" -ForegroundColor Green
