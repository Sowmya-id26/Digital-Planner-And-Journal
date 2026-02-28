
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { tasksApi } from '@/services/api';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/utils/cn';

const CATEGORIES = ['work', 'personal', 'hobbies'];
const PRIORITIES = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function TasksPage() {
  const { user } = useAuth(); // 🔥 important

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // 🔥 Load tasks function
  const load = async () => {
    if (!user) return;

    try {
      const res = await tasksApi.list();
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    }
  };

  // 🔥 Only run after user exists
  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const filtered =
    filter === 'all'
      ? tasks
      : tasks.filter((t) => t.category === filter);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(filtered);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);

    const updates = items.map((t, i) => ({
      id: t.id,
      order_index: i,
    }));

    tasksApi.reorder(updates).then(load);
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;

    await tasksApi.create({
      title: newTitle.trim(),
      category: filter !== 'all' ? filter : 'personal',
    });

    setNewTitle('');
    setAdding(false);
    load();
  };

  const toggle = (task) =>
    tasksApi
      .update(task.id, { completed: !task.completed })
      .then(load);

  const remove = (id) =>
    tasksApi.delete(id).then(load);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">
            Prioritize and track your to-dos
          </p>
        </div>
        <Button onClick={() => setAdding(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add task
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>

        {CATEGORIES.map((c) => (
          <Button
            key={c}
            variant={filter === c ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(c)}
          >
            {c}
          </Button>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {adding && (
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Task title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) =>
                  e.key === 'Enter' && addTask()
                }
              />
              <Button onClick={addTask}>Add</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAdding(false);
                  setNewTitle('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <ul
                  className="space-y-2"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {filtered.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={cn(
                            'flex items-center gap-2 rounded-lg border border-border p-3 bg-card',
                            task.completed && 'opacity-60'
                          )}
                        >
                          <span
                            {...provided.dragHandleProps}
                            className="cursor-grab text-muted-foreground"
                          >
                            <GripVertical className="h-4 w-4" />
                          </span>

                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggle(task)}
                            className="rounded border-input"
                          />

                          <span
                            className={cn(
                              'flex-1',
                              task.completed &&
                                'line-through text-muted-foreground'
                            )}
                          >
                            {task.title}
                          </span>

                          <span className="text-xs px-2 py-0.5 rounded bg-muted">
                            {task.category}
                          </span>

                          <span className="text-xs text-muted-foreground">
                            {PRIORITIES[task.priority]}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(task.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </li>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          {filtered.length === 0 && !adding && (
            <p className="text-muted-foreground text-center py-8">
              No tasks. Add one above.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}