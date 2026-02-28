

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { goalsApi } from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';

const TYPES = ['personal', 'academic', 'career'];

export function GoalsPage() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    type: 'personal'
  });

  const load = async () => {
    try {
      const res = await goalsApi.list();
      setGoals(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) load();
  }, [user]);

  const save = async () => {
    if (!form.title) return alert("Title required");

    await goalsApi.create(form);
    setModal(false);
    setForm({ title: '', type: 'personal' });
    load();
  };

  const removeGoal = async (id) => {
    await goalsApi.delete(id);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Goals</h1>
        <Button onClick={() => setModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add goal
        </Button>
      </div>

      {goals.map((g) => (
        <Card key={g.id}>
          <CardHeader className="flex justify-between">
            <CardTitle>{g.title}</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => removeGoal(g.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      ))}

      {goals.length === 0 && (
        <p className="text-muted-foreground text-center">
          No goals yet. Add one.
        </p>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96 space-y-4">
            <Input
              placeholder="Goal title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <select
              className="w-full border rounded px-3 py-2"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              {TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModal(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

