# Deployment Guide

This project is set up for:

- Backend: Render web service
- Frontend: Vercel static Vite app
- Database: MongoDB Atlas

## 1. Prepare MongoDB Atlas

In Atlas, open `Network Access` and allow Render to connect.

For the quickest free-tier setup, add:

```text
0.0.0.0/0
```

This is convenient for deployment, but less strict than a fixed IP allowlist.

## 2. Deploy Backend On Render

Create a new Render `Web Service` from your GitHub repo.

Use these settings:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add these Render environment variables:

```text
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<a long random secret>
FRONTEND_URL=<your Vercel frontend URL>
CORS_ORIGINS=<optional comma-separated extra frontend URLs>
```

Render will provide a backend URL like:

```text
https://your-backend-name.onrender.com
```

Check this URL in the browser. It should show:

```text
API is running...
```

## 3. Deploy Frontend On Vercel

Create a new Vercel project from the same GitHub repo.

Use these settings:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Add this Vercel environment variable:

```text
VITE_API_BASE_URL=https://your-backend-name.onrender.com/api
```

Optional staff access keys:

```text
VITE_DOCTOR_ACCESS_KEY=<doctor panel key>
VITE_ADMIN_ACCESS_KEY=<admin panel key>
```

These Vite values are included in the frontend bundle, so do not treat them as high-security secrets.

## 4. Final CORS Step

After Vercel deploys, copy the frontend URL and set it in Render:

```text
FRONTEND_URL=https://your-vercel-app.vercel.app
```

If you also want to allow Vercel preview deployments, add them to `CORS_ORIGINS` as a comma-separated list.

Then redeploy/restart the Render service.

## Local Development

Backend:

```bash
cd backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

For local development, the frontend can use the Vite proxy with `/api`, or you can create `frontend/.env`:

```text
VITE_API_BASE_URL=http://localhost:5002/api
```
