# Digital Planner & Journal – Frontend

A personal digital planner and journaling app to manage tasks, goals, calendar events, daily journal, mood, habits, and reminders.

## Features

- **Dashboard** – Overview with task completion, goals progress, mood trend, habits, and upcoming events
- **Calendar** – Monthly view with event creation, edit, delete; day/week/month toggle (UI)
- **Tasks** – To-do list with categories (work, personal, hobbies), priority, and drag-and-drop reordering
- **Journal** – Date-filtered daily entries with rich text area and save
- **Goals** – Goal dashboard with progress bars and +/- progress controls
- **Mood tracker** – Log mood per day and view trend chart
- **Habits** – Create habits and tick off completions in a weekly grid
- **Reminders** – Add reminders with type (task/event/self-care) and channel (push/email/sms)
- **Settings** – Theme (light/dark/system) and accent color customizer
- **Auth** – Sign up / Sign in with Supabase Auth; protected routes; JWT sent to backend

## Tech Stack

- **React** 18
- **Vite**
- **Tailwind CSS** for styling
- **ShadCN-style** UI (Button, Card, Input with CSS variables)
- **Axios** for API calls
- **React Router** v6
- **Recharts** for charts
- **react-beautiful-dnd** for drag-and-drop
- **date-fns** for dates
- **Lucide React** for icons
- **@supabase/supabase-js** for auth (session, sign up, sign in)

## Project Structure

```
src/
├── components/     # Reusable UI and layout
├── pages/          # Route pages
├── context/        # ThemeContext, LayoutContext
├── services/       # api.js (Axios + API methods)
├── utils/          # cn.js (classnames)
└── App.jsx
```

## Installation

1. Clone the repository and go to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` with your Supabase project (same as backend) for auth:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
   Optional, if the API is on another host: `VITE_API_URL=http://localhost:5000/api`
   With Vite proxy (default), ensure the backend runs on `http://localhost:5000`.

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Deployment (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Set environment variable `VITE_API_URL` to your deployed backend API (e.g. `https://your-app.onrender.com/api`)

## Backend API

The app expects the backend to be running and to expose these endpoints (see Backend README):

- `GET/POST/PUT/DELETE /api/events`
- `GET/POST/PUT/DELETE /api/tasks`, `POST /api/tasks/reorder`
- `GET/POST/DELETE /api/journal`, `GET /api/journal/date/:date`
- `GET/POST/PUT/DELETE /api/goals`
- `GET/POST/DELETE /api/mood`
- `GET/POST/PUT/DELETE /api/habits`, `GET /api/habits/completions`, `POST /api/habits/toggle`
- `GET/POST/PUT/DELETE /api/reminders`
- `GET/PUT /api/settings`

All requests can send `x-user-id` header (default: `default-user`).

## Login / Sign up

Use **Sign up** to create an account (email + password), then sign in. No email confirmation is required if you disable it in Supabase: **Authentication → Providers → Email** → turn off **Confirm email**. All data is scoped to your user; the backend verifies the Supabase JWT and uses the user id for all API calls.

## Screenshots

Add screenshots of Dashboard, Calendar, Tasks, and Journal here after deployment.

## Video Walkthrough

Add your video demonstration link here.
