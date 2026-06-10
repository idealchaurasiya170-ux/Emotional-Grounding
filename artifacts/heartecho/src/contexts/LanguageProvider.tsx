import { useState, type ReactNode } from "react";
import { LanguageContext, type Language, translations, type Translations } from "./LanguageContext";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [freeTrialEchoes, setFreeTrialEchoes] = useState(3);

  const useFreeTrialEcho = () => {
    setFreeTrialEchoes((prev) => Math.max(0, prev - 1));
  };

  const t = translations[language] as unknown as Translations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, freeTrialEchoes, useFreeTrialEcho }}>
      {children}
    </LanguageContext.Provider>
  );
}
