'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>({
  userPrompt: '',
  setUserPrompt: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [userPrompt, setUserPrompt] = useState<string>();

  return (
    <AppContext.Provider
      value={{
        userPrompt,
        setUserPrompt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
