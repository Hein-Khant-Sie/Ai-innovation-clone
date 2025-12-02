# Push to GitHub - Quick Guide

## Step 1: Open Terminal on your Mac
Press `Cmd + Space`, type "Terminal", press Enter

## Step 2: Navigate to your project
```bash
cd /Users/heinkhantsie/Project
```

## Step 3: Push to GitHub
```bash
git push -u origin main
```

## Step 4: When prompted:
- **Username:** `Hein-Khant-Sie`
- **Password:** Use a Personal Access Token (NOT your GitHub password)

## How to create a Personal Access Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name it: "My Project"
4. Check the `repo` checkbox
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. Paste it as the password when git asks

## After pushing:
Your code will be at: https://github.com/Hein-Khant-Sie/Ai-innovation-clone

Then you can deploy to Vercel!

