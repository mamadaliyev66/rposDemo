import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import uz from '../lang/uz';
import en from '../lang/en';

// Define the shape of the context
const AppContextState = {
  locale: 'uz',
  t: (key) => key, // Default translation function returns the key itself
  changeLocale: async (locale) => {},
};

// 1. Create the context
export const AppContext = createContext(AppContextState);

// 2. Create the provider component
export const AppProvider = ({ children }) => {
  const [locale, setLocale] = useState('uz'); // Default to Uzbek
  const [translations, setTranslations] = useState(uz);
  const [isReady, setIsReady] = useState(false); // To wait for language to be loaded

  // Load saved locale from storage on app start
  useEffect(() => {
    const loadLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('app-locale');
        if (savedLocale) {
          if (savedLocale === 'en') {
            setTranslations(en);
          } else {
            setTranslations(uz);
          }
          setLocale(savedLocale);
        }
      } catch (e) {
        console.error("Failed to load locale from storage.", e);
      } finally {
        setIsReady(true);
      }
    };

    loadLocale();
  }, []);

  // --- App Actions ---

  const changeLocale = async (newLocale) => {
    if (newLocale === locale) return; // No change needed

    try {
      await AsyncStorage.setItem('app-locale', newLocale);
      if (newLocale === 'en') {
        setTranslations(en);
      } else {
        setTranslations(uz); // Default to Uzbek if not 'en'
      }
      setLocale(newLocale);
    } catch (e) {
      console.error("Failed to save locale.", e);
    }
  };

  /**
   * The translation function.
   * @param {string} key - The key for the string to translate.
   * @returns {string} The translated string or the key if not found.
   */
  const t = (key) => {
    return translations[key] || key;
  };
  
  const value = {
    locale,
    changeLocale,
    t,
  };

  // Don't render the app until the language has been loaded from storage
  if (!isReady) {
    return null; // Or return your SplashScreen component
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};