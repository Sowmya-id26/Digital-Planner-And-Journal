import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/Layout/MainLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Dashboard } from '@/pages/Dashboard';
import { CalendarPage } from '@/pages/CalendarPage';
import { TasksPage } from '@/pages/TasksPage';
import { JournalPage } from '@/pages/JournalPage';
import { GoalsPage } from '@/pages/GoalsPage';
import { MoodPage } from '@/pages/MoodPage';
import { HabitsPage } from '@/pages/HabitsPage';
import { RemindersPage } from '@/pages/RemindersPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="goals" element={<GoalsPage />} />
        <Route path="mood" element={<MoodPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
