'use client';

import { createContext, useContext, useState } from 'react';

const AppContext = createContext<any>({
  userPrompt: '',
  setUserPrompt: () => {},
});

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [userPrompt, setUserPrompt] = useState<string>();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [hintLoading, setHintLoading] = useState<boolean>(false);
  const [stepsLoading, setStepsLoading] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        userPrompt,
        setUserPrompt,
        sendLoading,
        setSendLoading,
        hintLoading,
        setHintLoading,
        stepsLoading,
        setStepsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
