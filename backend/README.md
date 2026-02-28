# Digital Planner & Journal – Backend

REST API for the Digital Planner and Journal app. Built with Node.js, Express, and Supabase.

## Tech Stack

- **Node.js**
- **Express.js**
- **Supabase** (PostgreSQL) for database
- **Supabase Auth** – JWT verification (jsonwebtoken) so API uses the authenticated user id
- **dotenv** for environment variables
- **cors** for cross-origin requests

## Project Structure

```
backend/
├── config/         # supabase.js
├── controllers/    # events, tasks, journal, goals, mood, habits, reminders, userSettings
├── middleware/     # errorHandler.js
├── routes/         # API routes
├── utils/          # userId helper
├── supabase-schema.sql
├── server.js
└── package.json
```

## API Documentation

Base URL: `http://localhost:5000` (or your deployed URL).

**Authentication:** Send `Authorization: Bearer <supabase_access_token>` (frontend does this automatically). The backend verifies the JWT and uses the token’s `sub` as `user_id`. If no token or verification is skipped, it falls back to `x-user-id` or `default-user`.

### Events
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/events | List events (query: start, end) |
| POST | /api/events | Create event (body: title, start_time, end_time, description?, color?) |
| PUT | /api/events/:id | Update event |
| DELETE | /api/events/:id | Delete event |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | List tasks (query: category?, completed?) |
| POST | /api/tasks | Create task (body: title, category?, priority?, due_date?, order_index?) |
| PUT | /api/tasks/:id | Update task |
| POST | /api/tasks/reorder | Reorder (body: items: [{ id, order_index }]) |
| DELETE | /api/tasks/:id | Delete task |

### Journal
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/journal | List entries (query: start_date, end_date) |
| GET | /api/journal/date/:date | Get entry by date (YYYY-MM-DD) |
| POST | /api/journal | Create or update entry (body: entry_date, content?, attachments?) |
| DELETE | /api/journal/:id | Delete entry |

### Goals
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/goals | List goals (query: type?) |
| POST | /api/goals | Create goal |
| PUT | /api/goals/:id | Update goal (e.g. current_value) |
| DELETE | /api/goals/:id | Delete goal |

### Mood
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/mood | List logs (query: start_date, end_date) |
| POST | /api/mood | Log mood (body: log_date?, mood, note?) |
| DELETE | /api/mood/:id | Delete log |

### Habits
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/habits | List habits |
| GET | /api/habits/completions | List completions (query: start_date, end_date) |
| POST | /api/habits | Create habit |
| POST | /api/habits/toggle | Toggle completion (body: habit_id, completion_date?) |
| PUT | /api/habits/:id | Update habit |
| DELETE | /api/habits/:id | Delete habit |

### Reminders
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/reminders | List reminders (query: type?) |
| POST | /api/reminders | Create reminder |
| PUT | /api/reminders/:id | Update reminder |
| DELETE | /api/reminders/:id | Delete reminder |

### Settings
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/settings | Get user settings (theme, layout, accent_color) |
| PUT | /api/settings | Update settings |

## Database Schema (Supabase)

Run `supabase-schema.sql` in the Supabase SQL Editor to create:

- **events** – user_id, title, start_time, end_time, description, color
- **tasks** – user_id, title, category, priority, due_date, completed, order_index
- **journal_entries** – user_id, entry_date, content, attachments (JSONB)
- **goals** – user_id, title, type, target_value, current_value, unit, deadline
- **mood_logs** – user_id, log_date, mood, note
- **habits** – user_id, name, icon, order_index
- **habit_completions** – user_id, habit_id, completion_date
- **reminders** – user_id, title, remind_at, type, task_id, event_id, channel
- **user_settings** – user_id, theme, layout, accent_color

All tables use `user_id` (TEXT) for multi-tenant data. Foreign keys: habit_completions → habits; reminders → tasks, events.

## Installation

1. Clone the repo and go to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and set (get JWT Secret from Supabase → Project Settings → API):
   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_JWT_SECRET=your_jwt_secret
   ```

4. In Supabase Dashboard → SQL Editor, run the contents of `supabase-schema.sql`.

5. Start the server:
   ```bash
   npm start
   ```
   For development with auto-reload:
   ```bash
   npm run dev
   ```

## Deployment (Render)

- Runtime: Node
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and optionally `PORT`.

After deployment, set the frontend `VITE_API_URL` to `https://your-service.onrender.com/api`.
