# Z Book - Free Deployment Guide

This guide will help you deploy your Z Book Store to Render.com for **FREE**.

## Recent Fixes Applied

I've fixed the following issues:

✅ **Login/Signup Fixed** - Better error handling and CORS configuration  
✅ **Book Images Improved** - Now using high-quality generated covers with titles  
✅ **JWT Security** - Updated production-ready JWT secret  
✅ **Static Export** - Configured for free static hosting  

## What You Get (Free Tier)
- Backend API: Running 24/7
- Frontend: Static site hosting  
- HTTPS: Automatic SSL certificates
- Custom domain: Support available

## Prerequisites

Create free accounts on:
- [Render.com](https://render.com) - For hosting
- [MongoDB Atlas](https://www.mongodb.com/atlas) (optional - for real database)

## Quick Deploy - Option 1: Render (Recommended)

### Step 1: Create Backend Service

1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repo or upload code
4. Configure:
   - **Name**: `zbook-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/zbookstore
   JWT_SECRET=your_secure_random_string_here
   JWT_EXPIRE=7d
   PORT=10000
   NODE_ENV=production
   CLIENT_URL=https://zbook-frontend.onrender.com
   ```
6. Click "Create Web Service"

**Note**: Leave `MONGODB_URI` as above to use the built-in mock database (works great for testing!)

### Step 2: Create Frontend Service

1. In Render, click "New" → "Static Site"
2. Connect your repo
3. Configure:
   - **Name**: `zbook-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `out`
4. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://zbook-backend-XXXX.onrender.com/api
   ```
   (Use your actual backend URL from Step 1)
5. Click "Create Static Site"

### Step 3: Connect Frontend & Backend

After both deploy:
1. Copy your frontend URL (e.g., `https://zbook-frontend-abc123.onrender.com`)
2. Go to backend service → Environment
3. Update `CLIENT_URL` to your frontend URL
4. Redeploy backend

## Testing Your Deployed App

### Demo Accounts (Pre-configured)
- **Admin**: admin@zbook.com / admin123
- **Demo**: demo@zbook.com / demo123

### Create New Account
You can register new accounts on the deployed site!

## Features That Work

✅ User Registration  
✅ User Login/Logout  
✅ Browse 700+ Books  
✅ Add to Cart  
✅ View Book Details  
✅ Search & Filter Books  
✅ Responsive Design  

## Troubleshooting

### Login Not Working?
1. Check backend health: `https://your-backend.onrender.com/api/health`
2. Verify `NEXT_PUBLIC_API_BASE_URL` matches your backend URL
3. Check browser console for errors
4. Make sure `CLIENT_URL` in backend matches frontend URL

### Images Not Loading?
- Images are now using placehold.co which generates quality covers
- All images should work automatically

### CORS Errors?
- Update `CLIENT_URL` in backend environment variables
- Must match your frontend URL exactly

## Free Tier Limits

**Render Free Tier**:
- Web Services: Spin down after 15 min idle (wake on request ~30s delay)
- Static Sites: Always available
- Bandwidth: 100GB/month

**Mock Database**:
- Data persists while server runs
- Resets when server restarts (free tier spins down)
- For permanent data: Use MongoDB Atlas free tier

## Alternative: Deploy Backend Locally + Frontend on Render

If you want to keep backend running locally:

1. Use [ngrok](https://ngrok.com) to expose local backend:
   ```bash
   ngrok http 5001
   ```
2. Copy the ngrok URL (e.g., `https://abc123.ngrok.io`)
3. Set frontend env var: `NEXT_PUBLIC_API_BASE_URL=https://abc123.ngrok.io/api`

## Next Steps (Optional)

1. **Custom Domain**: Add in Render settings
2. **Real Database**: Set up MongoDB Atlas for persistent data
3. **Payment**: Add Stripe for real payments
4. **Email**: Integrate SendGrid for notifications

## Your App URLs After Deploy

- Frontend: `https://zbook-frontend-XXXX.onrender.com`
- Backend: `https://zbook-backend-XXXX.onrender.com`
- Health Check: `https://zbook-backend-XXXX.onrender.com/api/health`

## Need Help?

If issues occur:
1. Check Render logs (Dashboard → Service → Logs)
2. Verify all environment variables are set
3. Test API: `https://your-backend.onrender.com/api/health`
4. Check browser console for errors

---

## Original Vercel + Render Setup (Alternative)

See the old guide below if you prefer Vercel for frontend:

<details>
<summary>Click to expand Vercel deployment guide</summary>

### Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Framework: Next.js
4. Root Directory: `frontend`
5. Add env var: `NEXT_PUBLIC_API_BASE_URL=https://your-backend.onrender.com/api`

### Backend on Render

Same as above, just update `CLIENT_URL` to your Vercel domain.

</details>

Good luck with your Z Book Store! 📚
