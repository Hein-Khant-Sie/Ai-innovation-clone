# How to Get Your FREE Google AI API Key

## Step 1: Get Your Free API Key

1. Go to: **https://aistudio.google.com/app/apikey**
2. Sign in with your Google account (or create one if needed)
3. Click **"Create API Key"** or **"Get API Key"**
4. Select or create a Google Cloud project (you can use the default)
5. Copy your API key (it will look like: `AIza...`)

## Step 2: Add to Vercel

1. Go to your Vercel project: https://vercel.com/dashboard
2. Click on your project: `Ai-innovation-clone`
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"** (or **"Add"**)
5. Fill in:
   - **Name/Key:** `GOOGLE_AI_API_KEY`
   - **Value:** Paste your Google AI API key
   - **Environments:** Select Production, Preview, Development (or at least Production)
6. Click **"Save"**

## Step 3: Redeploy

1. Go to **Deployments** tab
2. Click the three dots (⋯) on the latest deployment
3. Click **"Redeploy"**

## That's it! 🎉

Your app will now use Google Gemini AI which has a **generous free tier**!

### Free Tier Limits:
- **60 requests per minute** (very generous!)
- **1,500 requests per day**
- **32,000 tokens per minute**

This should be more than enough for personal use and testing!

