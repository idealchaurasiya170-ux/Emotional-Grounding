import { Link } from "wouter";
import { PlayCircle, ShieldCheck, Mic, HeartHandshake, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

function GrandparentsHero() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-14">
      <svg viewBox="0 0 720 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-2xl" role="img" aria-label="Grandfather and grandmother sitting together, smiling warmly with headphones and a microphone">
        {/* Warm background setting */}
        <rect width="720" height="420" rx="28" fill="#FEF3C7"/>

        {/* Soft warm light gradient backdrop */}
        <ellipse cx="360" cy="210" rx="310" ry="180" fill="url(#bgGradient)" opacity="0.5"/>

        {/* Sofa/couch base */}
        <rect x="80" y="280" width="560" height="90" rx="20" fill="#B45309"/>
        <rect x="80" y="260" width="560" height="40" rx="14" fill="#D97706"/>
        {/* Sofa armrests */}
        <rect x="60" y="240" width="60" height="120" rx="14" fill="#B45309"/>
        <rect x="600" y="240" width="60" height="120" rx="14" fill="#B45309"/>
        {/* Sofa cushions */}
        <rect x="100" y="265" width="230" height="55" rx="10" fill="#FDE68A" opacity="0.6"/>
        <rect x="390" y="265" width="230" height="55" rx="10" fill="#FDE68A" opacity="0.6"/>

        {/* === GRANDMOTHER (left) === */}
        {/* Body */}
        <ellipse cx="255" cy="310" rx="70" ry="55" fill="#EF4444" opacity="0.9"/>
        {/* Saree/dress detail */}
        <ellipse cx="255" cy="312" rx="68" ry="52" fill="#DC2626"/>
        <path d="M190 310 Q255 280 320 310" stroke="#FCA5A5" strokeWidth="3" fill="none"/>
        <path d="M195 325 Q255 295 315 325" stroke="#FCA5A5" strokeWidth="2" fill="none"/>
        {/* Neck */}
        <rect x="240" y="230" width="30" height="35" rx="8" fill="#D4A574"/>
        {/* Head */}
        <ellipse cx="255" cy="210" rx="48" ry="52" fill="#D4A574"/>
        {/* White hair bun */}
        <ellipse cx="255" cy="165" rx="32" ry="22" fill="#F9FAFB"/>
        <ellipse cx="255" cy="163" rx="22" ry="14" fill="#E5E7EB"/>
        {/* Bun detail */}
        <circle cx="255" cy="158" r="8" fill="#9CA3AF"/>
        {/* Face */}
        {/* Eyes */}
        <ellipse cx="240" cy="205" rx="6" ry="7" fill="#1C1917"/>
        <ellipse cx="270" cy="205" rx="6" ry="7" fill="#1C1917"/>
        <circle cx="242" cy="203" r="2" fill="white"/>
        <circle cx="272" cy="203" r="2" fill="white"/>
        {/* Smile wrinkle lines */}
        <path d="M232 215 Q240 222 250 215" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        <path d="M250 215 Q260 222 268 215" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Nose */}
        <ellipse cx="255" cy="212" rx="5" ry="3.5" fill="#C4956A"/>
        {/* Big warm smile */}
        <path d="M234 224 Q255 242 276 224" stroke="#92400E" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Smile crinkles */}
        <path d="M228 218 Q222 225 226 230" stroke="#C4956A" strokeWidth="2" fill="none"/>
        <path d="M282 218 Q288 225 284 230" stroke="#C4956A" strokeWidth="2" fill="none"/>
        {/* Bindi */}
        <circle cx="255" cy="195" r="4" fill="#DC2626"/>
        {/* Earrings */}
        <circle cx="207" cy="213" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
        <circle cx="303" cy="213" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5"/>
        {/* Headphones */}
        <path d="M207 186 Q255 155 303 186" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="196" y="182" width="22" height="28" rx="8" fill="#1E293B"/>
        <rect x="199" y="185" width="16" height="22" rx="6" fill="#F59E0B"/>
        <rect x="502" y="182" width="22" height="28" rx="8" fill="#1E293B"/>

        {/* === GRANDFATHER (right) === */}
        {/* Body */}
        <ellipse cx="465" cy="308" rx="72" ry="58" fill="#1E3A5F" opacity="0.95"/>
        {/* Kurta detail */}
        <path d="M400 305 Q465 270 530 305" stroke="#3B82F6" strokeWidth="2.5" fill="none"/>
        <path d="M403 320 Q465 285 527 320" stroke="#3B82F6" strokeWidth="2" fill="none"/>
        {/* Collar */}
        <path d="M448 248 L455 268 L465 255 L475 268 L482 248" fill="#1E3A5F"/>
        {/* Neck */}
        <rect x="450" y="230" width="30" height="35" rx="8" fill="#C4956A"/>
        {/* Head */}
        <ellipse cx="465" cy="207" rx="50" ry="54" fill="#C4956A"/>
        {/* Grey hair */}
        <ellipse cx="465" cy="158" rx="42" ry="22" fill="#9CA3AF"/>
        <path d="M423 172 Q465 152 507 172" fill="#9CA3AF"/>
        {/* White side hair */}
        <ellipse cx="420" cy="185" rx="12" ry="18" fill="#D1D5DB"/>
        <ellipse cx="510" cy="185" rx="12" ry="18" fill="#D1D5DB"/>
        {/* Face */}
        <ellipse cx="449" cy="202" rx="6.5" ry="7.5" fill="#1C1917"/>
        <ellipse cx="481" cy="202" rx="6.5" ry="7.5" fill="#1C1917"/>
        <circle cx="451" cy="200" r="2.5" fill="white"/>
        <circle cx="483" cy="200" r="2.5" fill="white"/>
        {/* Nose */}
        <ellipse cx="465" cy="210" rx="6" ry="4" fill="#B07D55"/>
        {/* Big warm smile */}
        <path d="M443 222 Q465 242 487 222" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Teeth */}
        <path d="M446 226 Q465 240 484 226" fill="white" stroke="none"/>
        {/* Smile wrinkles */}
        <path d="M436 215 Q430 222 434 228" stroke="#B07D55" strokeWidth="2" fill="none"/>
        <path d="M494 215 Q500 222 496 228" stroke="#B07D55" strokeWidth="2" fill="none"/>
        {/* Eyebrows grey */}
        <path d="M440 192 Q449 187 458 192" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M472 192 Q481 187 490 192" stroke="#6B7280" strokeWidth="3" strokeLinecap="round" fill="none"/>
        {/* Moustache */}
        <path d="M452 216 Q465 222 478 216" stroke="#6B7280" strokeWidth="4" strokeLinecap="round" fill="none"/>
        {/* Glasses */}
        <rect x="437" y="196" width="26" height="18" rx="6" fill="none" stroke="#374151" strokeWidth="2.5"/>
        <rect x="467" y="196" width="26" height="18" rx="6" fill="none" stroke="#374151" strokeWidth="2.5"/>
        <line x1="463" y1="204" x2="467" y2="204" stroke="#374151" strokeWidth="2.5"/>
        <line x1="420" y1="205" x2="437" y2="205" stroke="#374151" strokeWidth="2"/>
        <line x1="493" y1="205" x2="511" y2="205" stroke="#374151" strokeWidth="2"/>
        {/* Headphones on grandfather */}
        <path d="M417 180 Q465 148 513 180" stroke="#1E293B" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <rect x="502" y="185" width="16" height="22" rx="6" fill="#F59E0B"/>

        {/* === MICROPHONE (center, between them) === */}
        <rect x="340" y="210" width="40" height="80" rx="20" fill="#374151"/>
        <rect x="338" y="207" width="44" height="52" rx="22" fill="#1E293B"/>
        <rect x="342" y="211" width="36" height="44" rx="18" fill="#374151"/>
        {/* Mic grille lines */}
        <line x1="348" y1="218" x2="372" y2="218" stroke="#6B7280" strokeWidth="1.5"/>
        <line x1="346" y1="226" x2="374" y2="226" stroke="#6B7280" strokeWidth="1.5"/>
        <line x1="346" y1="234" x2="374" y2="234" stroke="#6B7280" strokeWidth="1.5"/>
        <line x1="348" y1="242" x2="372" y2="242" stroke="#6B7280" strokeWidth="1.5"/>
        {/* Mic stand */}
        <rect x="356" y="288" width="8" height="40" rx="4" fill="#6B7280"/>
        <ellipse cx="360" cy="332" rx="28" ry="8" fill="#6B7280"/>
        {/* Recording active ring */}
        <circle cx="360" cy="232" r="36" fill="none" stroke="#F59E0B" strokeWidth="3" strokeDasharray="8 4" opacity="0.8"/>
        <circle cx="360" cy="232" r="48" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.4"/>

        {/* Holding hands in the middle */}
        <path d="M315 295 Q340 285 360 290 Q380 285 405 295" stroke="#D4A574" strokeWidth="12" strokeLinecap="round" fill="none"/>
        <path d="M320 292 Q360 278 400 292" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none"/>

        {/* Sound waves */}
        <path d="M180 232 Q175 220 180 208" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M170 238 Q162 218 170 198" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M540 232 Q545 220 540 208" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
        <path d="M550 238 Q558 218 550 198" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>

        {/* Floating heart */}
        <path d="M350 130 C350 127 346 124 343 124 C340 124 337 126 337 130 C337 134 340 137 350 143 C360 137 363 134 363 130 C363 126 360 124 357 124 C354 124 350 127 350 130Z" fill="#EF4444" opacity="0.8"/>
        <path d="M390 105 C390 103 387 101 385 101 C383 101 381 102 381 105 C381 108 383 110 390 114 C397 110 399 108 399 105 C399 102 397 101 395 101 C393 101 390 103 390 105Z" fill="#F59E0B" opacity="0.7"/>

        {/* "Recording" label */}
        <rect x="310" y="150" width="100" height="32" rx="16" fill="#F59E0B"/>
        <circle cx="327" cy="166" r="6" fill="#EF4444"/>
        <text x="342" y="171" fontFamily="sans-serif" fontSize="13" fontWeight="700" fill="#1E293B">Recording</text>

        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FDE68A"/>
            <stop offset="100%" stopColor="#FEF3C7" stopOpacity="0"/>
          </radialGradient>
        </defs>
      </svg>
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
