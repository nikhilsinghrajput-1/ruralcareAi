
'use client';

import { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash';

// A simple cache to store loaded language files
const translationsCache: { [key: string]: any } = {};

export function useTranslation(locale = 'en') {
  const [translations, setTranslations] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      if (!locale) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);

      // Check cache first
      if (translationsCache[locale]) {
        setTranslations(translationsCache[locale]);
        setIsLoading(false);
        return;
      }

      try {
        // Dynamically import the locale file
        const langModule = await import(`@/locales/${locale}.json`);
        translationsCache[locale] = langModule.default;
        setTranslations(langModule.default);
      } catch (error) {
        console.error(`Could not load locale: ${locale}`, error);
        // Fallback to English if the locale file is not found
        if (locale !== 'en') {
            const enModule = await import(`@/locales/en.json`);
            setTranslations(enModule.default);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [locale]);

  const t = useCallback((key: string): string => {
    if (!translations) {
      return key;
    }
    // Use lodash.get for safely accessing nested properties
    return get(translations, key, key);
  }, [translations]);

  return { t, isLoading };
}
