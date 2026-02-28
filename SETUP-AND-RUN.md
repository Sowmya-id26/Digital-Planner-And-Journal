# Digital Planner – Setup & Run (Windows)

## 1. Supabase setup

1. Go to [supabase.com](https://supabase.com) and create a project.
2. **Disable email confirmation** (so users can sign in right after sign up):
   - **Authentication** → **Providers** → **Email** → turn **OFF** “Confirm email” → Save.
3. In the dashboard: **SQL Editor** → New query → paste the full contents of `backend/supabase-schema.sql` → Run.
4. Go to **Project Settings** → **API** and copy:
   - **Project URL** → use as `SUPABASE_URL`
   - **anon public** key → use as `SUPABASE_ANON_KEY`
   - **JWT Secret** → use as `SUPABASE_JWT_SECRET` in backend `.env`

## 2. Backend

```powershell
cd "c:\Users\Sowmya\OneDrive\Desktop\New folder (2)\backend"
```

Create `.env` (copy from `.env.example` and fill in). In Supabase: **Project Settings → API** copy **Project URL**, **anon public**, and **JWT Secret**:

```env
PORT=5000
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_JWT_SECRET=your_jwt_secret_here
```

Then:

```powershell
npm install
npm start
```

Backend runs at **http://localhost:5000**. Leave this terminal open.

## 3. Frontend (new terminal)

```powershell
cd "c:\Users\Sowmya\OneDrive\Desktop\New folder (2)\frontend"
```

Create `.env` with the **same** Supabase project (so auth works):

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then:

```powershell
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**. Sign up or sign in to use the app; the backend verifies the JWT and scopes data by user.

## 4. Deploy backend (Render)

1. Push the **backend** folder to its own GitHub repo.
2. [render.com](https://render.com) → New → **Web Service** → connect that repo.
3. Settings:
   - **Root Directory:** (leave blank if repo is only backend, or set to `backend` if repo contains both)
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. **Environment:** Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (and `PORT` if needed).
5. Deploy. Copy the service URL (e.g. `https://digital-planner-api.onrender.com`).

## 5. Deploy frontend (Netlify)

1. Push the **frontend** folder to its own GitHub repo.
2. [netlify.com](https://netlify.com) → Add new site → **Import from Git** → that repo.
3. Settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. **Environment variables:** Add `VITE_API_URL` = `https://your-render-url.onrender.com/api`
5. Deploy.

## 6. After deployment

- **Frontend README:** Add the Netlify URL as “Deployed Project Link” and the Render URL as “Backend API Link”.
- **Backend README:** Add the Render URL as “Deployment Link”.
- Submit: Frontend repo link, Netlify link, and video walkthrough link as required.
