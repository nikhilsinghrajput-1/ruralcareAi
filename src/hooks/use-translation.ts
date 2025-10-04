
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
      // Always default to english if no locale
      const targetLocale = locale || 'en';
      
      setIsLoading(true);

      // Check cache first
      if (translationsCache[targetLocale]) {
        setTranslations(translationsCache[targetLocale]);
        setIsLoading(false);
        return;
      }

      try {
        // Dynamically import the locale file
        const langModule = await import(`@/locales/${targetLocale}.json`);
        translationsCache[targetLocale] = langModule.default;
        setTranslations(langModule.default);
      } catch (error) {
        console.error(`Could not load locale: ${targetLocale}`, error);
        // Fallback to English if the locale file is not found
        if (targetLocale !== 'en' && !translationsCache['en']) {
            const enModule = await import(`@/locales/en.json`);
            translationsCache['en'] = enModule.default;
            setTranslations(enModule.default);
        } else if (translationsCache['en']) {
            setTranslations(translationsCache['en']);
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
