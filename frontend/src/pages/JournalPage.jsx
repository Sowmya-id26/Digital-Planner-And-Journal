
import { useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { journalApi } from '@/services/api';
import { Calendar, Trash2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  const loadEntries = async () => {
    const res = await journalApi.list();
    setEntries(res.data || []);
  };

  const loadEntryByDate = async (date) => {
    const res = await journalApi.getByDate(date);
    setContent(res.data?.content || '');
  };

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    loadEntryByDate(selectedDate);
  }, [selectedDate]);

  const save = async () => {
    setSaving(true);

    await journalApi.save({
      entry_date: selectedDate,
      content
    });

    await loadEntries();
    await loadEntryByDate(selectedDate);

    setSaving(false);
  };

  const deleteEntry = async () => {
    const entry = entries.find(
      (e) => e.entry_date === selectedDate
    );

    if (!entry) return;

    await journalApi.delete(entry.id);

    setContent('');
    await loadEntries();
  };

  const datesWithEntries = entries.map((e) => e.entry_date);

  const recentDates = Array.from({ length: 14 }, (_, i) =>
    format(subDays(new Date(), i), 'yyyy-MM-dd')
  );

  const hasEntry = datesWithEntries.includes(selectedDate);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Journal</h1>
        <p className="text-muted-foreground">
          Daily reflections and notes
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* LEFT SIDE DATE CARD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Date
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-2">
            {/* INPUT BOX NOT CHANGED */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              
              
            className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <ul className="space-y-1">
              {recentDates.map((d) => (
                <li key={d}>
                  <button
                    onClick={() => setSelectedDate(d)}
                    className={cn(
                      // 🔥 ONLY CHANGE: dates now white
                      'w-full text-left text-sm py-1.5 px-2 rounded hover:bg-blue-600 transition',
                      selectedDate === d &&
                        'bg-black-200 hover:bg-blue-600'
                    )}
                  >
                    {format(new Date(d), 'MMM d, yyyy')}
                    {datesWithEntries.includes(d) && ' •'}
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* RIGHT SIDE JOURNAL CARD */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>
              {format(new Date(selectedDate), 'MMMM d, yyyy')}
            </CardTitle>

            <div className="flex gap-2">
              <Button onClick={save} disabled={saving}>
                {saving ? 'Saving...' : 'Save'}
              </Button>

              {hasEntry && (
                <Button
                  variant="destructive"
                  onClick={deleteEntry}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {/* TEXTAREA NOT CHANGED */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] w-full rounded-md border px-3 py-2 text-sm text-black"
              placeholder="Write your thoughts..."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}