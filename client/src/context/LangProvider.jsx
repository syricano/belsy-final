import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { translations, supportedLanguages } from '@/i18n';

const DEFAULT_LANG = 'en';
const LangContext = createContext();

const getStoredLanguage = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('belsy_lang');
};

const persistLanguage = (lang) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('belsy_lang', lang);
};

const normalizeLanguage = (value) => {
  if (!value) return DEFAULT_LANG;
  const normalized = value.toLowerCase();
  if (supportedLanguages.includes(normalized)) return normalized;
  const short = normalized.split('-')[0];
  return supportedLanguages.includes(short) ? short : DEFAULT_LANG;
};

const translate = (lang, key) => {
  const source = translations[lang] || translations[DEFAULT_LANG];
  const parts = key.split('.');
  let current = source;
  for (const part of parts) {
    current = current?.[part];
    if (current === undefined || current === null) break;
  }
  if (current === undefined || current === null) {
    const fallbackSource = translations[DEFAULT_LANG];
    current = parts.reduce((acc, part) => acc?.[part], fallbackSource);
  }
  return current ?? key;
};

export const LangProvider = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState(() => {
    const stored = initialLanguage || getStoredLanguage();
    return normalizeLanguage(stored || DEFAULT_LANG);
  });

  useEffect(() => {
    persistLanguage(language);
    axiosInstance.defaults.headers.common['Accept-Language'] = language;
  }, [language]);

  const setLanguageSafe = (lang) => {
    setLanguage(normalizeLanguage(lang));
  };

  const value = useMemo(() => ({
    language,
    setLanguage: setLanguageSafe,
    t: (key) => translate(language, key),
    supportedLanguages,
  }), [language]);

  return React.createElement(LangContext.Provider, { value }, children);
};

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang must be used within LangProvider');
  return ctx;
};

export { normalizeLanguage, translate };
