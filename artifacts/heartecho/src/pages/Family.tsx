import { useState, useRef, useEffect } from "react";
import { Phone, Video, Download, Heart, Clock, Users, Send, Mic, Sparkles, Zap, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardSummary, useListSessions } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import DonationModal from "@/components/ui/DonationModal";

const ELDER_NAME = "Dadi Margaret";
const ELDER_AVATAR = "https://i.pravatar.cc/300?img=68";

const PERSONA_RESPONSES: { keywords: string[]; responses: string[] }[] = [
  {
    keywords: ["childhood", "child", "young", "बचपन", "infancia", "niñez"],
    responses: [
      `Ah, what a beautiful question! I grew up in a small village where the mango trees were so tall they seemed to touch the clouds. We had nothing but love, and that was everything. Every evening the whole family would sit together and share stories under the stars.`,
      `My childhood was simple and full of joy. I remember waking up before sunrise to help my mother grind spices. The kitchen always smelled of cardamom and ginger. Those mornings were the most peaceful of my life.`,
    ],
  },
  {
    keywords: ["advice", "wisdom", "lesson", "life", "सलाह", "consejo", "vida"],
    responses: [
      `My dear, the greatest lesson I have learned is this: be patient with yourself and generous with others. Life is a long journey and you will stumble many times. Each time you rise, you become stronger than before.`,
      `Never let a day pass without telling someone you love that you love them. I have lived 82 years and I promise you — those words are never wasted. Family is everything. Everything else is just noise.`,
    ],
  },
  {
    keywords: ["food", "cook", "recipe", "खाना", "comida", "receta"],
    responses: [
      `Oh, now you are asking the right question! My kheer recipe has been in our family for four generations. The secret? Never rush the milk. Let it simmer slowly, stir it with patience, and add cardamom at the very end. It is a lesson in life as much as cooking!`,
      `Every Sunday I would make dal makhani from scratch. Your grandfather would say he could smell it from two streets away. Those flavours carry our whole family's history inside them.`,
    ],
  },
  {
    keywords: ["love", "marry", "husband", "grandfather", "दादा", "amor", "esposo"],
    responses: [
      `Your grandfather and I met at a festival — he spilled chai on my new dupatta and spent the whole evening apologising! I told him the stain never fully came out, but somehow he stayed in my heart perfectly. We were married the following spring.`,
      `Love is not the butterflies you feel at the beginning. Real love is seeing someone at their worst — tired, scared, wrong — and choosing to stay. Your grandfather and I chose each other every single day for 54 years.`,
    ],
  },
  {
    keywords: ["difficult", "hard", "struggle", "sad", "कठिन", "difícil", "triste"],
    responses: [
      `There were years of great hardship. When we first came here we had two suitcases and a lot of prayers. But I learned that difficulty is not the end of the story — it is just a chapter. And every chapter ends.`,
      `I lost my mother when I was 30 years old. I thought the grief would swallow me whole. But slowly — slowly — I found she was still with me. In the way I hum while cooking. In the way I fold a sari. She lives on through us all.`,
    ],
  },
  {
    keywords: ["favourite", "favorite", "पसंद", "favorito", "hobby", "interest"],
    responses: [
      `I have always loved tending my garden. Every flower that blooms feels like a small miracle. I also love reading poetry — Kabir, Mirza Ghalib, and yes, a little Shakespeare too! Knowledge has no borders, my dear.`,
      `Music has been my great companion all my life. Old Bollywood songs, a little classical — if you ever feel lost, let music find you. It always knows the way home.`,
    ],
  },
];

function getPersonaResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const entry of PERSONA_RESPONSES) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      const pool = entry.responses;
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  const defaults = [
    `What a wonderful thing to ask, my dear. Every question you ask means you care — and that alone makes my heart full. Come, sit with me and let us talk more.`,
    `You know, you remind me so much of myself when I was young — always curious, always searching. That is a gift. Never lose that curiosity.`,
    `I am so happy you wrote to me today. Life is busy and it is easy to forget to connect. But here you are. That is what matters most.`,
    `There is an old saying: "The one who asks questions never loses their way." Keep asking, my love. I am always here.`,
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
}

export default function Family() {
  const { t } = useLanguage();
  const { data: summary } = useGetDashboardSummary();
  const { data: sessions } = useListSessions();

  const [donationOpen, setDonationOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{ from: "user" | "elder"; text: string }[]>([
    { from: "elder", text: t.family.chatGreeting },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!chatInput.trim() || isTyping) return;
    const userText = chatInput.trim();
    setChatInput("");
    setMessages((prev) => [...prev, { from: "user", text: userText }]);
    setIsTyping(true);
    const delay = 1400 + Math.random() * 1000;
    setTimeout(() => {
      const response = getPersonaResponse(userText);
      setMessages((prev) => [...prev, { from: "elder", text: response }]);
      setIsTyping(false);
    }, delay);
  };

  return (
    <>
    <DonationModal open={donationOpen} onClose={() => setDonationOpen(false)} />
    <div className="max-w-7xl mx-auto py-14 px-6 space-y-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-primary mb-2">{t.family.title}</h1>
          <p className="text-xl text-muted-foreground">{t.family.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-4 bg-card p-4 rounded-2xl border border-border shadow-md">
          <div className="px-4 border-r border-border last:border-0">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">{t.family.recordings}</p>
            <p className="text-2xl font-bold text-primary">{summary?.totalRecordings ?? 24}</p>
          </div>
          <div className="px-4 border-r border-border last:border-0">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">{t.family.storyMinutes}</p>
            <p className="text-2xl font-bold text-primary">{summary?.totalStoriesMinutes ?? 156}m</p>
          </div>
          <div className="px-4">
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-widest mb-1">{t.family.capsules}</p>
            <p className="text-2xl font-bold text-primary">{summary?.timeCapsulesPending ?? 3}</p>
          </div>
        </div>
      </div>

      {/* ── PARIVAR CHAT SIMULATION ── */}
      <Card className="border-2 border-accent/30 shadow-xl overflow-hidden bg-gradient-to-br from-background to-accent/5">
        <CardHeader className="border-b border-border bg-card px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img src={ELDER_AVATAR} alt={ELDER_NAME} className="w-14 h-14 rounded-full object-cover border-2 border-accent shadow-md" />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
            </div>
            <div>
              <CardTitle className="text-2xl font-serif text-primary flex items-center gap-2">
                {t.family.chatTitle}
                <Sparkles className="w-5 h-5 text-accent" />
              </CardTitle>
              <p className="text-base text-muted-foreground mt-0.5">{t.family.chatSubtitle}</p>
            </div>
            <Badge className="ml-auto bg-accent/15 text-accent border-accent/30 text-sm px-3 py-1 font-semibold">
              <Mic className="w-3.5 h-3.5 mr-1.5" />
              Voice Heritage
            </Badge>
          </div>
        </CardHeader>

        {/* Messages */}
        <div className="h-80 overflow-y-auto px-6 py-5 space-y-4 bg-muted/10">
          {messages.map((msg, i) => (
            <div key={i} className={`flex items-end gap-3 ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
              {msg.from === "elder" && (
                <img src={ELDER_AVATAR} alt={ELDER_NAME} className="w-9 h-9 rounded-full object-cover border border-accent/40 shrink-0 mb-0.5" />
              )}
              <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl text-base leading-relaxed shadow-sm ${
                msg.from === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-background border border-border text-foreground rounded-bl-sm"
              }`}>
                {msg.from === "elder" && (
                  <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider">{ELDER_NAME}</p>
                )}
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-end gap-3 justify-start">
              <img src={ELDER_AVATAR} alt={ELDER_NAME} className="w-9 h-9 rounded-full object-cover border border-accent/40 shrink-0 mb-0.5" />
              <div className="bg-background border border-border rounded-2xl rounded-bl-sm px-5 py-3.5 shadow-sm">
                <p className="text-xs font-semibold text-accent mb-1.5 uppercase tracking-wider">{ELDER_NAME}</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border bg-card px-5 py-4 flex items-center gap-3">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t.family.chatPlaceholder}
            disabled={isTyping}
            className="flex-1 bg-muted/40 border border-border rounded-full px-5 py-3 text-base text-foreground outline-none focus:border-accent focus:bg-background transition-all placeholder:text-muted-foreground/60 disabled:opacity-50"
          />
          <Button
            onClick={sendMessage}
            disabled={!chatInput.trim() || isTyping}
            className="h-12 w-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all shrink-0 shadow-md hover:shadow-accent/30 hover:scale-105 disabled:opacity-50"
            aria-label={t.family.chatSend}
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </Card>

      {/* ── LEGACY TALK-TIME MINUTES BALANCE ── */}
      <Card className="border border-amber-200/60 bg-gradient-to-br from-[#0F172A] to-[#1E293B] shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Balance display */}
            <div className="flex-1 px-8 py-7 border-b md:border-b-0 md:border-r border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Legacy Talk-Time Minutes Balance</h3>
                  <p className="text-xs text-white/50">Resets on your billing date</p>
                </div>
              </div>
              <div className="flex items-end gap-3 mb-4">
                <span className="text-5xl font-bold text-white leading-none">
                  {(summary?.minutesIncluded ?? 80) - (summary?.minutesUsedThisMonth ?? 45)}
                </span>
                <span className="text-lg text-white/50 mb-1">/ {summary?.minutesIncluded ?? 80} mins remaining</span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
                  style={{
                    width: `${Math.max(5, (((summary?.minutesIncluded ?? 80) - (summary?.minutesUsedThisMonth ?? 45)) / (summary?.minutesIncluded ?? 80)) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-white/40 mt-2">{summary?.minutesUsedThisMonth ?? 45} mins used this month</p>
            </div>

            {/* Recharge options */}
            <div className="flex-1 px-8 py-7">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Instant Recharge</h4>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-amber-400/30 bg-amber-400/10 hover:bg-amber-400/20 hover:border-amber-400/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-sm group-hover:scale-110 transition-transform">+30</span>
                    <div className="text-left">
                      <p className="text-base font-semibold text-white">+30 Minutes</p>
                      <p className="text-xs text-white/50">Valid for 90 days</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-400">$9.99</span>
                </button>

                <button className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl border border-amber-400/50 bg-amber-400/15 hover:bg-amber-400/25 hover:border-amber-400/70 transition-all group relative overflow-hidden">
                  <div className="absolute top-2 right-14 text-[10px] font-bold text-[#0F172A] bg-amber-400 px-2 py-0.5 rounded-full">BEST VALUE</div>
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-xl bg-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-sm group-hover:scale-110 transition-transform">+80</span>
                    <div className="text-left">
                      <p className="text-base font-semibold text-white">+80 Minutes</p>
                      <p className="text-xs text-white/50">Valid for 180 days</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-amber-400">$19.99</span>
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border border-border shadow-lg overflow-hidden flex flex-col">
          <div className="bg-primary/5 p-8 flex-1 flex flex-col items-center justify-center min-h-[280px] border-b">
            <div className="w-28 h-28 rounded-full bg-primary/15 flex items-center justify-center mb-6 shadow-inner">
              <Video className="w-14 h-14 text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-primary font-bold">{t.family.videoConnect}</h3>
            <Badge variant="outline" className="mt-4 text-sm px-4 py-1 bg-background text-primary border-primary/50">
              {summary?.minutesIncluded ?? 80} {t.family.minsMonthly}
            </Badge>
          </div>
          <CardContent className="p-6 bg-card">
            <div className="flex justify-between items-center mb-5">
              <span className="text-lg text-muted-foreground">{t.family.usedThisMonth}</span>
              <span className="text-xl font-bold text-foreground">{summary?.minutesUsedThisMonth ?? 45} {t.family.mins}</span>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 text-lg h-13 rounded-xl shadow-sm">{t.family.startVideo}</Button>
              <Button variant="outline" size="lg" className="flex-1 text-lg h-13 rounded-xl border-accent text-accent hover:bg-accent/10">{t.family.topUp}</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-lg overflow-hidden flex flex-col relative group">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
          <div className="bg-card p-8 flex-1 flex flex-col items-center justify-center min-h-[280px] border-b">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
              <div className="relative w-28 h-28 rounded-full bg-muted border-4 border-accent flex items-center justify-center overflow-hidden z-10 shadow-xl">
                <img src={ELDER_AVATAR} alt="Senior Portrait" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="text-2xl font-serif text-primary font-bold">{t.family.pulsePortrait}</h3>
            <Badge className="mt-4 text-sm px-4 py-1 bg-accent text-accent-foreground hover:bg-accent">
              {t.family.unlimitedAudio}
            </Badge>
          </div>
          <CardContent className="p-6 bg-card flex items-center justify-center">
            <Button size="lg" className="w-full text-xl h-14 rounded-xl bg-primary hover:bg-primary/90 shadow-lg">
              <Phone className="mr-3 w-6 h-6" /> {t.family.connectAudio}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upgrades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl">
          <CardContent className="p-8 flex flex-col h-full justify-between">
            <div>
              <Users className="w-12 h-12 mb-6 text-accent" />
              <h3 className="text-2xl font-serif font-bold mb-3">{t.family.multiUser}</h3>
              <p className="text-primary-foreground/80 text-lg mb-6 leading-relaxed">{t.family.multiUserDesc}</p>
            </div>
            <Button className="w-full bg-background text-primary hover:bg-background/90 text-lg h-13">
              {t.family.upgradeMulti}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border shadow-md col-span-1 lg:col-span-2 flex flex-col md:flex-row items-center">
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-serif text-primary font-bold mb-3">{t.family.lifeBio}</h3>
            <p className="text-lg text-muted-foreground mb-6">{t.family.lifeBioDesc}</p>
            <div className="flex items-center gap-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-13 rounded-full shadow-md">
                <Download className="mr-2 w-5 h-5" /> {t.family.purchasePkg}
              </Button>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">{t.family.oneTime}</span>
            </div>
          </div>
          <div className="p-8 hidden md:block">
            <div className="w-32 h-40 bg-muted rounded border shadow-inner flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
              <span className="text-muted-foreground font-serif text-center px-4">The Story<br />of Us</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Call History & Donation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="col-span-1 lg:col-span-3 shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" /> {t.family.recentHistory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sessions?.length ? (
              <div className="space-y-3">
                {sessions.slice(0, 5).map((session) => (
                  <div key={session.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-background border border-border flex items-center justify-center text-primary shadow-sm">
                        {session.sessionType === "video" ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                      </div>
                      <div>
                        <p className="text-lg font-medium text-foreground capitalize">{session.sessionType} {t.family.videoCall}</p>
                        <p className="text-sm text-muted-foreground">{new Date(session.startedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-lg font-bold text-foreground">{session.durationMinutes} {t.family.mins}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-lg text-muted-foreground py-10 text-center bg-muted/20 rounded-xl">
                {t.family.noCalls}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border border-accent/20 shadow-sm flex flex-col items-center justify-center text-center p-8">
          <Heart className="w-12 h-12 text-accent fill-current mb-4" />
          <h4 className="text-xl font-serif text-foreground font-bold mb-2">{t.family.supportMission}</h4>
          <p className="text-muted-foreground mb-6">{t.family.supportDesc}</p>
          <Button
            variant="outline"
            onClick={() => setDonationOpen(true)}
            className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg rounded-full"
          >
            {t.family.donate}
          </Button>
        </Card>
      </div>
    </div>
    </>
  );
}
