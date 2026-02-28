import { NavLink, useNavigate } from 'react-router-dom';
import { Calendar, CheckSquare, BookOpen, Target, Heart, Flame, Bell, BarChart3, Settings, LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const nav = [
  { to: '/', icon: BarChart3, label: 'Dashboard' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/journal', icon: BookOpen, label: 'Journal' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/mood', icon: Heart, label: 'Mood' },
  { to: '/habits', icon: Flame, label: 'Habits' },
  { to: '/reminders', icon: Bell, label: 'Reminders' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card flex flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <span className="text-xl font-semibold">Planner</span>
      </div>
      <nav className="flex flex-col gap-1 p-4 flex-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground truncate px-2 mb-2" title={user?.email}>{user?.email}</p>
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>
    </aside>
  );
}
