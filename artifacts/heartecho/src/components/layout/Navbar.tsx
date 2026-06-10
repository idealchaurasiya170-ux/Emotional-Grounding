import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { Heart, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import DonationModal from "@/components/ui/DonationModal";

const LANG_LABELS: Record<Language, string> = {
  en: "EN — English",
  es: "ES — Español",
  hi: "HI — हिन्दी",
};

const LANG_SHORT: Record<Language, string> = {
  en: "EN",
  es: "ES",
  hi: "HI",
};

export default function Navbar() {
  const { language, setLanguage, t, freeTrialEchoes } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const [donationOpen, setDonationOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectLang = (lang: Language) => {
    setLanguage(lang);
    setLangOpen(false);
  };

  return (
    <>
    <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 text-primary shrink-0">
          <Heart className="h-8 w-8 text-accent fill-current" />
          <span className="font-serif text-2xl font-bold tracking-tight">HeartEcho</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">{t.nav.home}</Link>
          <Link href="/vault" className="hover:text-primary transition-colors">{t.nav.vault}</Link>
          <Link href="/archive" className="hover:text-primary transition-colors">{t.nav.archive}</Link>
          <Link href="/family" className="hover:text-primary transition-colors">{t.nav.family}</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Free trial echo counter badge */}
          {freeTrialEchoes > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 bg-accent/10 border border-accent/30 text-accent rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap">
              <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                {freeTrialEchoes}
              </span>
              <span className="hidden lg:inline">Free Echoes</span>
            </div>
          )}

          {/* Language dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-base font-medium text-muted-foreground hover:text-primary"
              aria-label="Select language"
            >
              <span className="font-semibold tracking-wide">{LANG_SHORT[language]}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${langOpen ? "rotate-180" : ""}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-background border border-border rounded-xl shadow-xl py-2 z-50">
                {(["en", "es", "hi"] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => selectLang(lang)}
                    className="w-full flex items-center justify-between px-4 py-3 text-base text-left hover:bg-muted transition-colors"
                  >
                    <span className={language === lang ? "font-semibold text-primary" : "text-foreground"}>
                      {LANG_LABELS[lang]}
                    </span>
                    {language === lang && <Check className="h-4 w-4 text-accent" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Donation button */}
          <Button
            size="lg"
            onClick={() => setDonationOpen(true)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold rounded-full px-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            {t.nav.support}
          </Button>
        </div>
      </div>
    </header>
    </>
  );
}
