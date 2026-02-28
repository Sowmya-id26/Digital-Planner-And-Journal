import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { tasksApi, goalsApi, moodApi, habitsApi, eventsApi } from '@/services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { format, subDays } from 'date-fns';
import { CheckSquare, Target, Heart, Flame, Calendar } from 'lucide-react';

export function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);
  const [moodLogs, setMoodLogs] = useState([]);
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    Promise.all([
      tasksApi.list().then((r) => setTasks(r.data)),
      goalsApi.list().then((r) => setGoals(r.data)),
      moodApi.list().then((r) => setMoodLogs(r.data)),
      habitsApi.list().then((r) => setHabits(r.data)),
      habitsApi.completions().then((r) => setCompletions(r.data)),
      eventsApi.list().then((r) => setEvents(r.data)),
    ]).catch(console.error);
  }, []);

  const completedToday = tasks.filter((t) => t.completed).length;
  const totalTasks = tasks.length;
  const progressGoals = goals.map((g) => ({
    name: g.title.slice(0, 12),
    progress: Math.min(100, ((g.current_value || 0) / (g.target_value || 1)) * 100),
  }));
  const moodData = moodLogs.slice(0, 14).reverse().map((m) => ({ date: m.log_date, mood: ['sad', 'ok', 'good', 'great', 'amazing'].indexOf(m.mood) + 1 }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your productivity and well-being</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tasks Done</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedToday} / {totalTasks || 0}</div>
            <p className="text-xs text-muted-foreground">Completed today</p>
            <Link to="/tasks" className="text-sm text-primary hover:underline mt-1 inline-block">View tasks</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">Active goals</p>
            <Link to="/goals" className="text-sm text-primary hover:underline mt-1 inline-block">View goals</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodLogs.length}</div>
            <p className="text-xs text-muted-foreground">Entries this month</p>
            <Link to="/mood" className="text-sm text-primary hover:underline mt-1 inline-block">Log mood</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Habits</CardTitle>
            <Flame className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.length}</div>
            <p className="text-xs text-muted-foreground">Tracked habits</p>
            <Link to="/habits" className="text-sm text-primary hover:underline mt-1 inline-block">View habits</Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Goal progress</CardTitle>
          </CardHeader>
          <CardContent>
            {progressGoals.length ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={progressGoals}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="progress" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Add goals to see progress here.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mood trend</CardTitle>
          </CardHeader>
          <CardContent>
            {moodData.length ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={moodData}>
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm">Log your mood to see trends.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming events</CardTitle>
        </CardHeader>
        <CardContent>
          {events.filter((e) => new Date(e.start_time) >= new Date()).length ? (
            <ul className="space-y-2">
              {events
                .filter((e) => new Date(e.start_time) >= new Date())
                .slice(0, 5)
                .map((e) => (
                  <li key={e.id} className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {e.title} — {format(new Date(e.start_time), 'MMM d, h:mm a')}
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">No upcoming events. <Link to="/calendar" className="text-primary hover:underline">Add one</Link></p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
