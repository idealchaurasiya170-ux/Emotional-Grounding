import { useState } from "react";
import { Link } from "wouter";
import { Heart, MessageCircle, X, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import LegalModal from "@/components/ui/LegalModal";

const SUPPORT_RESPONSES = [
  "Thank you for reaching out! A HeartEcho care specialist will respond within 2 hours.",
  "We've received your message and our family support team will be in touch very soon.",
  "Your question has been passed to our senior support specialist. We'll reply shortly!",
  "Thank you! We treasure every family using HeartEcho. Someone from our team will contact you soon.",
];

export default function Footer() {
  const { t } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: t.chat.greeting },
  ]);
  const [legalModal, setLegalModal] = useState<null | "terms" | "privacy">(null);

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    const userText = chatMsg.trim();
    setChatMsg("");
    setMessages((prev) => [
      ...prev,
      { from: "user", text: userText },
      { from: "bot", text: SUPPORT_RESPONSES[Math.floor(Math.random() * SUPPORT_RESPONSES.length)] },
    ]);
  };

  return (
    <>
      <LegalModal
        open={legalModal !== null}
        onClose={() => setLegalModal(null)}
        type={legalModal ?? "terms"}
      />

      <footer className="bg-primary text-primary-foreground mt-auto relative">
        {/* Encryption guarantee banner */}
        <div className="bg-accent/20 border-b border-accent/30 py-3.5">
          <div className="container flex items-center justify-center gap-3 text-accent-foreground/90">
            <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
            <p className="text-base font-medium text-center">{t.footer.encryption}</p>
          </div>
        </div>

        <div className="container py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-5">
                <Heart className="h-8 w-8 text-accent fill-current" />
                <span className="font-serif text-3xl font-bold tracking-tight text-white">HeartEcho</span>
              </Link>
              <p className="text-primary-foreground/75 max-w-sm text-lg leading-relaxed">
                {t.footer.tagline}
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-xl mb-5 text-white tracking-wide">{t.footer.navigation}</h4>
              <ul className="space-y-3 text-lg text-primary-foreground/75">
                <li><Link href="/" className="hover:text-white transition-colors">{t.nav.home}</Link></li>
                <li><Link href="/vault" className="hover:text-white transition-colors">{t.nav.vault}</Link></li>
                <li><Link href="/archive" className="hover:text-white transition-colors">{t.nav.archive}</Link></li>
                <li><Link href="/family" className="hover:text-white transition-colors">{t.nav.family}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-xl mb-5 text-white tracking-wide">{t.footer.legal}</h4>
              <ul className="space-y-3 text-lg text-primary-foreground/75">
                <li>
                  <button
                    onClick={() => setLegalModal("terms")}
                    className="hover:text-white transition-colors text-left underline-offset-2 hover:underline"
                  >
                    {t.footer.terms}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setLegalModal("privacy")}
                    className="hover:text-white transition-colors text-left underline-offset-2 hover:underline"
                  >
                    {t.footer.privacy}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/15 pt-8 flex flex-col md:flex-row items-center justify-between text-primary-foreground/55 text-sm gap-3">
            <p className="text-center md:text-left">{t.footer.encryption}</p>
            <p className="text-center md:text-right">&copy; {new Date().getFullYear()} {t.footer.rights}</p>
          </div>
        </div>

        {/* ── Floating Chat Widget ── */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {chatOpen && (
            <div className="w-84 bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3.5 bg-primary">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                    <Heart className="h-4 w-4 text-accent fill-current" />
                  </div>
                  <span className="font-semibold text-white text-base">{t.chat.title}</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-primary-foreground/60 hover:text-white transition-colors rounded-full p-1">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/20">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-background border border-border text-foreground rounded-bl-sm"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 px-3 py-3 border-t border-border bg-background">
                <input
                  value={chatMsg}
                  onChange={(e) => setChatMsg(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={t.chat.placeholder}
                  className="flex-1 bg-muted/40 rounded-full px-4 py-2 text-sm text-foreground outline-none border border-border focus:border-accent transition-colors"
                />
                <button
                  onClick={sendMessage}
                  className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0 shadow-sm"
                  aria-label={t.chat.send}
                >
                  <Send className="h-4 w-4 text-accent-foreground" />
                </button>
              </div>
            </div>
          )}

          <Button
            size="icon"
            onClick={() => setChatOpen((o) => !o)}
            className="h-16 w-16 rounded-full shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105 hover:shadow-accent/40 hover:shadow-2xl"
          >
            {chatOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
            <span className="sr-only">{t.chat.title}</span>
          </Button>
        </div>
      </footer>
    </>
  );
}
