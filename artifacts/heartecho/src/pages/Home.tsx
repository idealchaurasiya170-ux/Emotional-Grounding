import { Link } from "wouter";
import { PlayCircle, ShieldCheck, Mic, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-background pt-16 pb-24 px-6 md:px-12 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-primary max-w-4xl leading-tight mb-8">
          Preserve Their Voice.<br /> Keep Their Stories Alive Forever.
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-light">
          A beautifully simple, secure space for families to record and treasure the life stories of their elders.
        </p>

        {/* Video Placeholder */}
        <div className="relative w-full max-w-5xl aspect-video bg-muted rounded-2xl overflow-hidden shadow-2xl group flex items-center justify-center border border-border">
          <div className="absolute inset-0 bg-primary/10 transition-colors group-hover:bg-primary/20"></div>
          <Button size="icon" variant="ghost" className="relative z-10 w-24 h-24 rounded-full bg-background/80 hover:bg-background text-primary shadow-xl backdrop-blur-sm transition-transform hover:scale-105">
            <PlayCircle className="w-12 h-12" />
          </Button>
          <div className="absolute bottom-6 left-0 right-0 text-center z-10">
            <p className="bg-background/80 text-foreground px-6 py-2 rounded-full inline-block backdrop-blur-sm text-lg font-medium shadow-md">
              Watch how HeartEcho connects generations
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-6">
          <Link href="/onboarding">
            <Button size="lg" className="text-xl px-10 py-8 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
              Start Your Digital Portrait
            </Button>
          </Link>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full bg-card py-24 px-6 md:px-12 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-center mb-20 text-primary">How HeartEcho Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">1</span>
                <ShieldCheck className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Setup</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Create a secure, private memory profile. Add emergency contacts to ensure stories are preserved safely.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">2</span>
                <Mic className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Record Weekly</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Use our beautifully simple voice recorder. Receive thoughtful prompts to inspire meaningful memories.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 relative transition-transform group-hover:scale-110">
                <span className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-xl shadow-md">3</span>
                <HeartHandshake className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-foreground">Connect Forever</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Listen, share, and connect. A lasting Voice Heritage that future generations will treasure.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}