-- Optional: Row Level Security (RLS) for Supabase
-- Use this if you ever call Supabase directly from the frontend with the user's session.
-- When using the Node backend only, the API already scopes data by user_id from the JWT.

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own events" ON events FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own journal_entries" ON journal_entries FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own goals" ON goals FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own mood_logs" ON mood_logs FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own habits" ON habits FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own habit_completions" ON habit_completions FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own reminders" ON reminders FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can manage own user_settings" ON user_settings FOR ALL USING (auth.uid()::text = user_id);
