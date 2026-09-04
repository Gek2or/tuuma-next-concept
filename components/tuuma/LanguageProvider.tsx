"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Locale = "fi" | "en" | "sv";
export type LocalizedText = Record<Locale, string>;

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  text: (copy: LocalizedText) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fi");

  useEffect(() => {
    const stored = localStorage.getItem("tuuma-locale");
    if (stored === "fi" || stored === "en" || stored === "sv") {
      document.documentElement.lang = stored;
      queueMicrotask(() => setLocaleState(stored));
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem("tuuma-locale", next);
    document.documentElement.lang = next;
  }

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, setLocale, text: (copy) => copy[locale] }),
    [locale],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
