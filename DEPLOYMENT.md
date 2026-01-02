# Vercel Deployment Guide

This guide will walk you through deploying your React Machine Coding app to Vercel step by step.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account
- Your project pushed to a Git repository
- A Vercel account (free tier is sufficient)

---

## Step-by-Step Deployment Process

### Step 1: Prepare Your Repository

1. **Ensure your code is committed and pushed to Git:**
   ```bash
   git status
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Verify your project structure:**
   - ✅ `package.json` exists with build scripts
   - ✅ `vercel.json` exists (already created)
   - ✅ `.gitignore` includes `node_modules` and `build`

### Step 2: Create a Vercel Account

1. Go to [https://vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Log In"**
3. Sign up using one of these methods:
   - **GitHub** (Recommended - easiest integration)
   - **GitLab**
   - **Bitbucket**
   - **Email**

### Step 3: Import Your Project

1. After logging in, you'll see the Vercel dashboard
2. Click **"Add New..."** button (or **"Import Project"**)
3. You'll see a list of your Git repositories
4. Find and select your `react-machine-coding` repository
5. If you don't see your repository:
   - Click **"Adjust GitHub App Permissions"** or **"Configure Git Provider"**
   - Grant Vercel access to your repositories
   - Refresh the page

### Step 4: Configure Project Settings

Vercel will auto-detect your Create React App project. Verify these settings:

**Framework Preset:** `Create React App` (auto-detected)

**Build Settings:**
- **Root Directory:** `./` (leave as default)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `build` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

**Environment Variables:**
- If your app uses any API keys or environment variables, add them here
- Click **"Add"** for each variable:
  - **Name:** `REACT_APP_API_KEY` (example)
  - **Value:** `your-api-key-here`
- For this project, you likely don't need any unless you're using external APIs

### Step 5: Deploy

1. Review all settings
2. Click **"Deploy"** button
3. Vercel will:
   - Install dependencies (`npm install`)
   - Build your project (`npm run build`)
   - Deploy to a production URL

### Step 6: Wait for Deployment

1. You'll see a deployment log in real-time
2. The build process typically takes 1-3 minutes
3. Once complete, you'll see:
   - ✅ **"Ready"** status
   - A production URL (e.g., `react-machine-coding.vercel.app`)

### Step 7: Access Your Deployed App

1. Click on the deployment URL
2. Your app should be live! 🎉
3. Test navigation to ensure client-side routing works:
   - Try visiting routes like `/counter`, `/todo-list`, etc.
   - All routes should work correctly

---

## Post-Deployment Configuration

### Custom Domain (Optional)

1. In your Vercel project dashboard, go to **Settings** → **Domains**
2. Enter your custom domain (e.g., `myapp.com`)
3. Follow Vercel's DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### Environment Variables (If Needed Later)

1. Go to **Settings** → **Environment Variables**
2. Add any new variables needed
3. Redeploy for changes to take effect

### Automatic Deployments

Vercel automatically deploys:
- **Production:** Every push to `main` or `master` branch
- **Preview:** Every push to other branches (creates preview URLs)

---

## Troubleshooting

### Issue: Build Fails

**Solution:**
1. Check the build logs in Vercel dashboard
2. Common issues:
   - Missing dependencies → Check `package.json`
   - TypeScript errors → Fix errors locally first
   - Build timeout → Optimize build process

### Issue: Routes Return 404

**Solution:**
- The `vercel.json` file should handle this with rewrites
- Verify `vercel.json` exists in your project root
- Ensure it contains the rewrite rule for client-side routing

### Issue: Assets Not Loading

**Solution:**
- Check that `package.json` has `"homepage": "."` if needed
- For Create React App, this is usually not required
- Verify build output directory is `build`

### Issue: Environment Variables Not Working

**Solution:**
- Environment variables must start with `REACT_APP_` prefix
- Add them in Vercel dashboard: **Settings** → **Environment Variables**
- Redeploy after adding variables

---

## Manual Deployment via Vercel CLI (Alternative Method)

If you prefer using the command line:

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

```bash
# From your project root directory
vercel

# For production deployment
vercel --prod
```

### Step 4: Follow Prompts

- Link to existing project or create new
- Confirm settings
- Deploy!

---

## Project Configuration Files

### `vercel.json`

This file is already created in your project root. It configures:
- Build command
- Output directory
- Client-side routing rewrites

### Key Configuration:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

The `rewrites` rule ensures all routes are handled by React Router.

---

## Deployment Checklist

Before deploying, ensure:

- [ ] Code is committed and pushed to Git
- [ ] `package.json` has correct build scripts
- [ ] `vercel.json` exists in project root
- [ ] `.gitignore` includes `node_modules` and `build`
- [ ] Project builds successfully locally (`npm run build`)
- [ ] No TypeScript or linting errors
- [ ] Environment variables (if any) are documented

---

## Quick Reference

**Vercel Dashboard:** [https://vercel.com/dashboard](https://vercel.com/dashboard)

**Vercel Documentation:** [https://vercel.com/docs](https://vercel.com/docs)

**Support:** [https://vercel.com/support](https://vercel.com/support)

---

## Next Steps After Deployment

1. ✅ Share your live URL with others
2. ✅ Set up a custom domain (optional)
3. ✅ Monitor deployments in Vercel dashboard
4. ✅ Set up analytics (optional)
5. ✅ Configure preview deployments for pull requests

---

**Congratulations! Your React Machine Coding app is now live on Vercel! 🚀**

