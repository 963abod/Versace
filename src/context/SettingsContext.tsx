'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings, Language } from '@/types';

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  refreshSettings: () => Promise<void>;
  t: (key: string, arText: string, enText?: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<Language>('ar');

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, arText: string, enText?: string) => {
    if (language === 'en' && enText) return enText;
    return arText;
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        language,
        setLanguage,
        refreshSettings: fetchSettings,
        t,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
