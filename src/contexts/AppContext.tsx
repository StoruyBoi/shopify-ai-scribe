
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserCredits } from '@/types';

interface AppContextState {
  credits: UserCredits;
  setCredits: (credits: Partial<UserCredits>) => void;
  useCredit: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AppContext = createContext<AppContextState | undefined>(undefined);

const defaultCredits: UserCredits = { current: 3, max: 3 };

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Load credits from localStorage if available
  const [credits, setCreditsState] = useState<UserCredits>(() => {
    if (typeof window !== 'undefined') {
      const savedCredits = localStorage.getItem('shopify-credits');
      const savedDate = localStorage.getItem('shopify-credits-date');
      
      // Check if credits were saved today
      const today = new Date().toDateString();
      if (savedCredits && savedDate === today) {
        try {
          return JSON.parse(savedCredits);
        } catch {
          return defaultCredits;
        }
      }
      
      // Reset credits for a new day
      localStorage.setItem('shopify-credits', JSON.stringify(defaultCredits));
      localStorage.setItem('shopify-credits-date', today);
    }
    
    return defaultCredits;
  });

  // Update localStorage when credits change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopify-credits', JSON.stringify(credits));
    }
  }, [credits]);

  const setCredits = (newCredits: Partial<UserCredits>) => {
    setCreditsState(prev => ({ ...prev, ...newCredits }));
  };

  const useCredit = () => {
    if (credits.current > 0) {
      setCreditsState(prev => ({ ...prev, current: prev.current - 1 }));
      return true;
    }
    return false;
  };

  return (
    <AppContext.Provider value={{
      credits,
      setCredits,
      useCredit,
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
