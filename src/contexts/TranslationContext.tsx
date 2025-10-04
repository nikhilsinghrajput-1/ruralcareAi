'use client';

import { createContext, useContext } from 'react';

type TranslationContextType = {
  t: (key: string) => string;
  isLoading: boolean;
};

export const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useAppTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useAppTranslation must be used within a TranslationProvider');
  }
  return context;
};
