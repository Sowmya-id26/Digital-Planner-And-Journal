# 🧠 Digital Planner and Journal

A full-stack productivity web application that helps users manage daily tasks and maintain personal journal entries in one place.
This project demonstrates complete CRUD operations, authentication, API integration, and modern UI design.

---

## 📌 Features

* ✅ User Authentication (Login / Signup)
* 📝 Create, Edit, Delete Tasks
* 📅 Write Journal Entries by Date
* 🗂️ View Previous Journal Records
* 🔐 Secure Backend API
* 📱 Responsive UI Design
* ⚡ Fast performance using Vite

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router DOM
* Tailwind CSS
* Lucide React Icons
* Axios

### Backend

* Node.js
* Express.js
* MongoDB / Supabase (Update based on what you used)
* JWT Authentication

---

## 📂 Project Structure

```
Digital-Planner-and-Journal/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/digital-planner-and-journal.git
cd digital-planner-and-journal
```

---

### 2️⃣ Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

### 3️⃣ Setup Backend

```bash
cd backend
npm install
npm start
```

Backend will run on:

```
http://localhost:5000
```

---

## 🔐 Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=your_database_connection_string
JWT_SECRET=your_secret_key
```

If using Supabase:

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

## 📡 API Endpoints

### Authentication

* `POST /api/auth/register`
* `POST /api/auth/login`

### Tasks

* `GET /api/tasks`
* `POST /api/tasks`
* `PUT /api/tasks/:id`
* `DELETE /api/tasks/:id`

### Journal

* `GET /api/journal`
* `POST /api/journal`
* `DELETE /api/journal/:id`

---

## 🎯 Future Enhancements

* 🌙 Dark Mode Toggle
* 🔔 Task Reminder Notifications
* 📊 Productivity Analytics Dashboard
* 📱 Mobile App Version

---

## 👨‍💻 Author

**Macharla Brahmachary**
B.Tech Final Year Student
Aspiring Cybersecurity Analyst

---

