
import React, { createContext, useContext, useState } from 'react';

interface AppContextState {
  credits: number;
  setCredits: (credits: number) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(3); // Default 3 credits per day
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{
      credits,
      setCredits,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
