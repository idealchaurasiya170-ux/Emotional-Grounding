import { Link } from "wouter";
import { PlayCircle, ShieldCheck, Mic, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

function GrandparentsHero() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-14">
      <div
        className="w-full overflow-hidden"
        style={{
          borderRadius: "24px",
          boxShadow: "0 8px 48px rgba(245,158,11,0.22), 0 2px 16px rgba(15,23,42,0.18), 0 0 0 1px rgba(245,158,11,0.12)",
        }}
      >
        <img
          src="http://googleusercontent.com/image_collection/image_retrieval/3820257529457814467"
          alt="Grandfather and grandmother sitting together on a porch, smiling warmly while looking at an old family photograph — a moment of pure shared memory and family love"
          className="w-full h-auto object-cover"
          style={{ display: "block" }}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        {/* Warm fallback if image can't load */}
        <div
          className="w-full aspect-[16/9] bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 items-center justify-center"
          style={{ display: "none" }}
        >
          <div className="text-center px-8">
            <div className="text-6xl mb-4">👴🏻👵🏻</div>
            <p className="text-amber-800 font-serif text-xl leading-relaxed">
              "Every story you preserve is a gift<br />that never stops giving."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t, freeTrialEchoes } = useLanguage();

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-background pt-14 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
        {/* Free Trial Echoes Banner */}
        {freeTrialEchoes > 0 && (
          <div className="flex items-center gap-2 bg-accent/10 border border-accent/40 text-accent rounded-full px-6 py-2.5 mb-8 text-base font-semibold shadow-sm">
            <Sparkles className="w-5 h-5" />
            <span>{freeTrialEchoes} {t.hero.freeTrial}</span>
          </div>
        )}

        <h1 className="text-4xl md:text-6xl font-serif text-primary max-w-4xl leading-tight mb-6">
          {t.hero.headline1}<br />{t.hero.headline2}
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light leading-relaxed">
          {t.hero.sub}
        </p>

        {/* Grandparents Hero Illustration */}
        <GrandparentsHero />

        {/* Video Placeholder */}
        <div className="relative w-full max-w-5xl aspect-video bg-primary/5 rounded-2xl overflow-hidden shadow-2xl group flex items-center justify-center border-2 border-border hover:border-accent/50 transition-colors">
          {/* Gradient overlay simulating video thumbnail */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 transition-colors group-hover:from-primary/25" />

          {/* Play button */}
          <button
            className="relative z-10 flex flex-col items-center gap-4 focus:outline-none group/play"
            aria-label="Play explainer video"
          >
            <div className="w-24 h-24 rounded-full bg-accent shadow-2xl flex items-center justify-center transition-transform group-hover/play:scale-110 group-hover/play:shadow-accent/40 group-hover/play:shadow-2xl">
              <PlayCircle className="w-12 h-12 text-accent-foreground fill-accent-foreground/20" />
            </div>
          </button>

          {/* Caption */}
          <div className="absolute bottom-6 left-0 right-0 text-center z-10">
            <p className="bg-background/90 text-foreground px-6 py-2.5 rounded-full inline-block backdrop-blur-sm text-lg font-medium shadow-lg border border-border/50">
              {t.hero.videoCaption}
            </p>
          </div>

          {/* "1 min" badge */}
          <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-full shadow">
            1 min
          </div>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row gap-6">
          <Link href="/onboarding">
            <Button
              size="lg"
              className="text-xl px-12 py-8 rounded-full shadow-xl hover:shadow-accent/30 transition-all hover:-translate-y-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.hero.cta}
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-card py-24 px-6 md:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-20 text-primary">
            {t.howItWorks.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">
                  1
                </span>
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t.howItWorks.step1Title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.howItWorks.step1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">
                  2
                </span>
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t.howItWorks.step2Title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.howItWorks.step2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">
                  3
                </span>
                <HeartHandshake className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">{t.howItWorks.step3Title}</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">{t.howItWorks.step3Desc}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
