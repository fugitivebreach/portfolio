# 🚀 Deploy to Railway

## Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub account

## Step 2: Push to GitHub
1. Create a new repository on GitHub
2. In your portfolio folder, run:
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

## Step 3: Deploy on Railway
1. Go to [railway.app/dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your portfolio repository
5. Railway will automatically detect it's a Node.js project
6. Click "Deploy"

## Step 4: Get Your URL
- Railway will provide a URL like: `https://your-project-name.up.railway.app`
- Your portfolio will be live in ~2-3 minutes!

## Auto-Deploy
- Any changes you push to GitHub will automatically redeploy
- Perfect for updating your config.json or adding new content

## Environment Variables (Optional)
If you need any environment variables:
1. Go to your Railway project dashboard
2. Click "Variables" tab
3. Add any needed variables

Your portfolio is now live on the internet! 🌐
