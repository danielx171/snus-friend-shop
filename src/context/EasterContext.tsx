import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

interface EasterContextType {
  isEasterMode: boolean;
  toggleEaster: () => void;
}

const EasterContext = createContext<EasterContextType>({ isEasterMode: false, toggleEaster: () => {} });

export const useEaster = () => useContext(EasterContext);

const STORAGE_KEY = 'sf_easter_mode';

export function EasterProvider({ children }: { children: React.ReactNode }) {
  const [isEasterMode, setIsEasterMode] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === 'true'; } catch { return false; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(isEasterMode)); } catch {}
  }, [isEasterMode]);

  const toggleEaster = useCallback(() => {
    setIsEasterMode(prev => !prev);
  }, []);

  return (
    <EasterContext.Provider value={{ isEasterMode, toggleEaster }}>
      {children}
    </EasterContext.Provider>
  );
}
