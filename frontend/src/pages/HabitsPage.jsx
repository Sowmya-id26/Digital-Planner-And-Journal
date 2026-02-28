// import { useAuth } from '@/context/AuthContext';
// import { useState, useEffect } from 'react';
// import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
// import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Input } from '@/components/ui/Input';
// import { habitsApi } from '@/services/api';
// import { Plus, Trash2 } from 'lucide-react';

// export function HabitsPage() {
//   const [habits, setHabits] = useState([]);
//   const [completions, setCompletions] = useState([]);
//   const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
//   const [adding, setAdding] = useState(false);
//   const [newName, setNewName] = useState('');

//   const load = () => {
//     habitsApi.list().then((r) => setHabits(r.data)).catch(console.error);
//     const start = format(weekStart, 'yyyy-MM-dd');
//     const end = format(addDays(weekStart, 6), 'yyyy-MM-dd');
//     habitsApi.completions({ start_date: start, end_date: end }).then((r) => setCompletions(r.data)).catch(console.error);
//   };
//   useEffect(load, [weekStart]);

//   const isCompleted = (habitId, date) => completions.some((c) => c.habit_id === habitId && c.completion_date === date);

//   const toggle = (habitId, date) => {
//     habitsApi.toggle({ habit_id: habitId, completion_date: date }).then(load);
//   };

//   const addHabit = () => {
//     if (!newName.trim()) return;
//     habitsApi.create({ name: newName.trim() }).then(() => { setNewName(''); setAdding(false); load(); });
//   };

//   const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold">Habits</h1>
//           <p className="text-muted-foreground">Track daily habits and consistency</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" size="sm" onClick={() => setWeekStart(subWeeks(weekStart, 1))}>Prev</Button>
//           <Button variant="outline" size="sm" onClick={() => setWeekStart(addWeeks(weekStart, 1))}>Next</Button>
//           <Button onClick={() => setAdding(true)}><Plus className="h-4 w-4 mr-2" />Add habit</Button>
//         </div>
//       </div>

//       {adding && (
//         <Card>
//           <CardContent className="pt-6 flex gap-2">
//             <Input placeholder="Habit name" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()} />
//             <Button onClick={addHabit}>Add</Button>
//             <Button variant="outline" onClick={() => { setAdding(false); setNewName(''); }}>Cancel</Button>
//           </CardContent>
//         </Card>
//       )}

//       <Card>
//         <CardContent className="pt-6 overflow-x-auto">
//           <table className="w-full min-w-[500px]">
//             <thead>
//               <tr className="border-b border-border">
//                 <th className="text-left py-2 font-medium">Habit</th>
//                 {weekDays.map((d) => (
//                   <th key={d.toISOString()} className="text-center py-2 text-sm font-medium">{format(d, 'EEE d')}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {habits.map((h) => (
//                 <tr key={h.id} className="border-b border-border">
//                   <td className="py-2 flex items-center gap-2">
//                     <span>{h.name}</span>
//                     <Button variant="ghost" size="icon" onClick={() => habitsApi.delete(h.id).then(load)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
//                   </td>
//                   {weekDays.map((d) => {
//                     const dateStr = format(d, 'yyyy-MM-dd');
//                     const done = isCompleted(h.id, dateStr);
//                     return (
//                       <td key={dateStr} className="text-center py-2">
//                         <button
//                           type="button"
//                           onClick={() => toggle(h.id, dateStr)}
//                           className={`h-8 w-8 rounded-full border-2 transition-colors ${done ? 'bg-primary border-primary' : 'border-border hover:border-primary'}`}
//                         />
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//           {habits.length === 0 && !adding && <p className="text-muted-foreground text-center py-8">No habits. Add one to start tracking.</p>}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, subWeeks, addWeeks } from 'date-fns';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { habitsApi } from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';

export function HabitsPage() {
  const { user } = useAuth(); // 🔥 IMPORTANT

  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [weekStart, setWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');

  const load = async () => {
    if (!user) return; // 🔥 prevent 401

    try {
      const habitsRes = await habitsApi.list();
      setHabits(habitsRes.data);

      const start = format(weekStart, 'yyyy-MM-dd');
      const end = format(addDays(weekStart, 6), 'yyyy-MM-dd');

      const completionsRes = await habitsApi.completions({
        start_date: start,
        end_date: end,
      });

      setCompletions(completionsRes.data);
    } catch (err) {
      console.error("Failed to load habits:", err);
    }
  };

  // 🔥 wait for user before loading
  useEffect(() => {
    if (!user) return;
    load();
  }, [user, weekStart]);

  const isCompleted = (habitId, date) =>
    completions.some(
      (c) =>
        c.habit_id === habitId &&
        c.completion_date === date
    );

  const toggle = async (habitId, date) => {
    if (!user) return;

    await habitsApi.toggle({
      habit_id: habitId,
      completion_date: date,
    });

    load();
  };

  const addHabit = async () => {
    if (!newName.trim() || !user) return;

    await habitsApi.create({
      name: newName.trim(),
    });

    setNewName('');
    setAdding(false);
    load();
  };

  const removeHabit = async (id) => {
    if (!user) return;

    await habitsApi.delete(id);
    load();
  };

  const weekDays = Array.from(
    { length: 7 },
    (_, i) => addDays(weekStart, i)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-muted-foreground">
            Track daily habits and consistency
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
          >
            Prev
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}
          >
            Next
          </Button>

          <Button onClick={() => setAdding(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add habit
          </Button>
        </div>
      </div>

      {adding && (
        <Card>
          <CardContent className="pt-6 flex gap-2">
            <Input
              placeholder="Habit name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && addHabit()
              }
            />
            <Button onClick={addHabit}>Add</Button>
            <Button
              variant="outline"
              onClick={() => {
                setAdding(false);
                setNewName('');
              }}
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6 overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 font-medium">
                  Habit
                </th>
                {weekDays.map((d) => (
                  <th
                    key={d.toISOString()}
                    className="text-center py-2 text-sm font-medium"
                  >
                    {format(d, 'EEE d')}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {habits.map((h) => (
                <tr
                  key={h.id}
                  className="border-b border-border"
                >
                  <td className="py-2 flex items-center gap-2">
                    <span>{h.name}</span>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeHabit(h.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>

                  {weekDays.map((d) => {
                    const dateStr = format(
                      d,
                      'yyyy-MM-dd'
                    );
                    const done = isCompleted(
                      h.id,
                      dateStr
                    );

                    return (
                      <td
                        key={dateStr}
                        className="text-center py-2"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            toggle(
                              h.id,
                              dateStr
                            )
                          }
                          className={`h-8 w-8 rounded-full border-2 transition-colors ${
                            done
                              ? 'bg-primary border-primary'
                              : 'border-border hover:border-primary'
                          }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {habits.length === 0 && !adding && (
            <p className="text-muted-foreground text-center py-8">
              No habits. Add one to start tracking.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}