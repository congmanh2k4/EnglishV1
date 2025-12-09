#!/bin/bash

# Script để chuẩn bị deploy lên Vercel

echo "🚀 Preparing for Vercel deployment..."
echo ""

# Check if .env exists in backend
if [ -f "backend/.env" ]; then
    echo "⚠️  WARNING: backend/.env exists!"
    echo "   This file should NOT be committed to Git"
    echo "   Make sure it's in .gitignore"
    echo ""
fi

# Check if .gitignore includes .env
if grep -q "^\.env$" backend/.gitignore; then
    echo "✅ backend/.gitignore includes .env"
else
    echo "❌ backend/.gitignore does NOT include .env"
    echo "   Add '.env' to backend/.gitignore"
    exit 1
fi

# Check git status
echo ""
echo "📋 Checking git status..."
if git ls-files | grep -q "\.env"; then
    echo "❌ ERROR: .env file is tracked in git!"
    echo "   Run: git rm --cached backend/.env"
    echo "   Then: git commit -m 'Remove .env from tracking'"
    exit 1
else
    echo "✅ No .env files are tracked in git"
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure you've deleted the old exposed API key"
echo "2. Create a new API key at: https://aistudio.google.com/app/apikey"
echo "3. Deploy to Vercel and set GEMINI_API_KEY in environment variables"
echo ""
echo "Ready to deploy! 🎉"
