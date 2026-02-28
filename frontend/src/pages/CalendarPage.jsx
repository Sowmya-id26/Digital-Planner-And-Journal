import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, addMonths, subMonths, isSameMonth, isSameDay } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { eventsApi } from '@/services/api';
import { ChevronLeft, ChevronRight, Plus, Calendar } from 'lucide-react';

const VIEWS = { month: 'Month', week: 'Week', day: 'Day' };

export function CalendarPage() {
  const [current, setCurrent] = useState(new Date());
  const [view, setView] = useState('month');
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', start_time: '', end_time: '', description: '', color: '#6366f1' });

  const loadEvents = () => {
    const start = startOfMonth(subMonths(current, 1));
    const end = endOfMonth(addMonths(current, 1));
    eventsApi.list({ start: start.toISOString(), end: end.toISOString() }).then((r) => setEvents(r.data)).catch(console.error);
  };

  useEffect(loadEvents, [current]);

  const handleSave = () => {
    if (!form.title || !form.start_time || !form.end_time) return;
    const payload = {
      ...form,
      start_time: new Date(form.start_time).toISOString(),
      end_time: new Date(form.end_time).toISOString(),
    };
    if (modal?.id) {
      eventsApi.update(modal.id, payload).then(loadEvents).then(() => setModal(null));
    } else {
      eventsApi.create(payload).then(loadEvents).then(() => setModal(null));
    }
  };

  const handleDelete = () => {
    if (modal?.id) eventsApi.delete(modal.id).then(loadEvents).then(() => setModal(null));
  };

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const start = startOfWeek(monthStart);
  const end = endOfWeek(monthEnd);
  const days = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getEventsForDay = (d) => events.filter((e) => isSameDay(new Date(e.start_time), d));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">Manage events and schedule</p>
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(VIEWS).map(([k, v]) => (
            <Button key={k} variant={view === k ? 'default' : 'outline'} size="sm" onClick={() => setView(k)}>{v}</Button>
          ))}
          <Button size="icon" onClick={() => { const today = format(new Date(), 'yyyy-MM-dd'); setModal({}); setForm({ title: '', start_time: today + 'T09:00', end_time: today + 'T10:00', description: '', color: '#6366f1' }); }}><Plus className="h-5 w-5" /></Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setCurrent(subMonths(current, 1))}><ChevronLeft className="h-5 w-5" /></Button>
            {format(current, 'MMMM yyyy')}
            <Button variant="ghost" size="icon" onClick={() => setCurrent(addMonths(current, 1))}><ChevronRight className="h-5 w-5" /></Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
            {weekDays.map((d) => (
              <div key={d} className="bg-muted/50 p-2 text-center text-sm font-medium">{d}</div>
            ))}
            {days.map((d) => {
              const dayEvents = getEventsForDay(d);
              return (
                <div
                  key={d.toISOString()}
                  className={`min-h-[100px] bg-card p-2 ${!isSameMonth(d, current) ? 'opacity-50' : ''}`}
                  onClick={() => { const dStr = format(d, 'yyyy-MM-dd'); setModal({ date: d }); setForm({ title: '', start_time: dStr + 'T09:00', end_time: dStr + 'T10:00', description: '', color: '#6366f1' }); }}
                >
                  <span className="text-sm font-medium">{format(d, 'd')}</span>
                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="text-xs truncate rounded px-1 py-0.5 text-white cursor-pointer"
                        style={{ backgroundColor: e.color || '#6366f1' }}
                        onClick={(ev) => { ev.stopPropagation(); setModal({ ...e }); setForm({ title: e.title, start_time: e.start_time?.slice(0, 16), end_time: e.end_time?.slice(0, 16), description: e.description || '', color: e.color || '#6366f1' }); }}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && <span className="text-xs text-muted-foreground">+{dayEvents.length - 2}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setModal(null)}>
          <div className="bg-card rounded-xl shadow-lg max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">{modal.id ? 'Edit event' : 'New event'}</h3>
            <div className="space-y-4">
              <Input placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
              <div className="grid grid-cols-2 gap-2">
                <input type="datetime-local" className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.start_time} onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))} />
                <input type="datetime-local" className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.end_time} onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))} />
              </div>
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              <div className="flex items-center gap-2">
                <span className="text-sm">Color</span>
                <input type="color" value={form.color} onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))} className="h-10 w-14 cursor-pointer rounded border" />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button onClick={handleSave}>Save</Button>
              {modal.id && <Button variant="destructive" onClick={handleDelete}>Delete</Button>}
              <Button variant="outline" onClick={() => setModal(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
