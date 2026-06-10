import { useState } from "react";
import { Link } from "wouter";
import { Heart, MessageCircle, X, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState<{ from: "bot" | "user"; text: string }[]>([
    { from: "bot", text: t.chat.greeting },
  ]);

  const sendMessage = () => {
    if (!chatMsg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: chatMsg },
      { from: "bot", text: "Thank you for reaching out! Our support team will be with you shortly." },
    ]);
    setChatMsg("");
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-auto relative">
      {/* Encryption guarantee banner */}
      <div className="bg-accent/20 border-b border-accent/30 py-3">
        <div className="container flex items-center justify-center gap-3 text-accent-foreground/90">
          <ShieldCheck className="h-5 w-5 text-accent shrink-0" />
          <p className="text-base font-medium text-center">{t.footer.encryption}</p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-accent fill-current" />
              <span className="font-serif text-3xl font-bold tracking-tight text-white">HeartEcho</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-sm text-lg">
              {t.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-xl mb-4 text-white">{t.footer.navigation}</h4>
            <ul className="space-y-3 text-lg text-primary-foreground/80">
              <li><Link href="/" className="hover:text-white transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/vault" className="hover:text-white transition-colors">{t.nav.vault}</Link></li>
              <li><Link href="/archive" className="hover:text-white transition-colors">{t.nav.archive}</Link></li>
              <li><Link href="/family" className="hover:text-white transition-colors">{t.nav.family}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xl mb-4 text-white">{t.footer.legal}</h4>
            <ul className="space-y-3 text-lg text-primary-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-primary-foreground/70 text-base">
          <p>{t.footer.encryption}</p>
          <p className="mt-4 md:mt-0">&copy; {new Date().getFullYear()} {t.footer.rights}</p>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Chat window */}
        {chatOpen && (
          <div className="w-80 bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center justify-between px-4 py-3 bg-primary">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent fill-current" />
                <span className="font-semibold text-white text-base">{t.chat.title}</span>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-primary-foreground/70 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 max-h-64 overflow-y-auto bg-muted/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-base ${
                    msg.from === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-background border border-border text-foreground rounded-bl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            {/* Input */}
            <div className="flex items-center gap-2 px-3 py-3 border-t border-border bg-background">
              <input
                value={chatMsg}
                onChange={(e) => setChatMsg(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder={t.chat.placeholder}
                className="flex-1 bg-muted/50 rounded-full px-4 py-2 text-base text-foreground outline-none border border-border focus:border-accent transition-colors"
              />
              <button
                onClick={sendMessage}
                className="w-10 h-10 rounded-full bg-accent flex items-center justify-center hover:bg-accent/90 transition-colors shrink-0"
                aria-label={t.chat.send}
              >
                <Send className="h-4 w-4 text-accent-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Toggle button */}
        <Button
          size="icon"
          onClick={() => setChatOpen((o) => !o)}
          className="h-16 w-16 rounded-full shadow-xl bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105"
        >
          {chatOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
          <span className="sr-only">{t.chat.title}</span>
        </Button>
      </div>
    </footer>
  );
}
