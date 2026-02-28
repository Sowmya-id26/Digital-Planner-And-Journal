import { createContext, useContext, useState, useEffect } from 'react';
import { settingsApi } from '@/services/api';

const defaultLayout = ['calendar', 'tasks', 'goals', 'habits', 'mood', 'journal'];

const LayoutContext = createContext();

export function LayoutProvider({ children }) {
  const [layout, setLayoutState] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboardLayout');
      return saved ? JSON.parse(saved) : defaultLayout;
    } catch {
      return defaultLayout;
    }
  });

  useEffect(() => {
    localStorage.setItem('dashboardLayout', JSON.stringify(layout));
  }, [layout]);

  const setLayout = (newLayout) => setLayoutState(newLayout);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
}

export const useLayout = () => useContext(LayoutContext);
