import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor } from 'lucide-react';

export function SettingsPage() {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Customize theme and layout</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant={theme === 'light' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('light')}><Sun className="h-4 w-4 mr-2" />Light</Button>
          <Button variant={theme === 'dark' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('dark')}><Moon className="h-4 w-4 mr-2" />Dark</Button>
          <Button variant={theme === 'system' ? 'default' : 'outline'} size="sm" onClick={() => setTheme('system')}><Monitor className="h-4 w-4 mr-2" />System</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Accent color</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="h-12 w-12 cursor-pointer rounded-lg border" />
          <input type="text" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="flex h-10 w-24 rounded-md border border-input bg-background px-3 py-2 text-sm" />
        </CardContent>
      </Card>
    </div>
  );
}
