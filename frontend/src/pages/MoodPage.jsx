
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { moodApi } from '@/services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Smile, Meh, Frown, Trash2 } from 'lucide-react';

const MOODS = [
  { value: 'sad', label: 'Sad', icon: Frown, color: '#94a3b8' },
  { value: 'ok', label: 'Okay', icon: Meh, color: '#fbbf24' },
  { value: 'good', label: 'Good', icon: Smile, color: '#34d399' },
  { value: 'great', label: 'Great', color: '#6366f1' },
  { value: 'amazing', label: 'Amazing', color: '#a855f7' }
];

export function MoodPage() {
  const { user } = useAuth();

  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  /* ===============================
     LOAD MOODS
  ================================ */
  const load = async () => {
    if (!user) return;
    try {
      const res = await moodApi.list();
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to load mood logs:", err);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  /* ===============================
     LOAD SELECTED DATE DATA
  ================================ */
  useEffect(() => {
    const existing = logs.find((l) => l.log_date === selectedDate);
    if (existing) {
      setSelectedMood(existing.mood);
      setNote(existing.note || '');
    } else {
      setSelectedMood(null);
      setNote('');
    }
  }, [selectedDate, logs]);

  /* ===============================
     SAVE MOOD (UPSERT)
  ================================ */
  const submit = async () => {
    if (!selectedMood) return;

    await moodApi.log({
      log_date: selectedDate,
      mood: selectedMood,
      note
    });

    load();
  };

  /* ===============================
     DELETE MOOD
  ================================ */
  const deleteMood = async () => {
    const existing = logs.find((l) => l.log_date === selectedDate);
    if (!existing) return;

    await moodApi.delete(existing.id);
    setSelectedMood(null);
    setNote('');
    load();
  };

  /* ===============================
     CHART DATA
  ================================ */
  const moodScale = ['sad', 'ok', 'good', 'great', 'amazing'];

  const chartData = logs
    .slice(0, 30)
    .reverse()
    .map((m) => ({
      date: m.log_date,
      mood: moodScale.indexOf(m.mood) + 1
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Log and visualize your emotional state
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* LOG MOOD */}
        <Card>
          <CardHeader>
            <CardTitle>Log mood</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => setSelectedMood(m.value)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      selectedMood === m.value
                        ? 'ring-2 ring-offset-2 ring-primary scale-105 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    style={
                      selectedMood === m.value
                        ? { backgroundColor: m.color }
                        : {}
                    }
                  >
                    {Icon && <Icon size={16} />}
                    {m.label}
                  </button>
                );
              })}
            </div>

            <textarea
              placeholder="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />

            <div className="flex gap-2">
              <Button onClick={submit} disabled={!selectedMood}>
                Save
              </Button>

              {logs.find((l) => l.log_date === selectedDate) && (
                <Button variant="destructive" onClick={deleteMood}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle>Last 30 Days Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">
                Log your mood to see trends.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}