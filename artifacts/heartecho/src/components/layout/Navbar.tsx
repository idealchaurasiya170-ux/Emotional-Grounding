import { Link } from "wouter";
import { Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Heart className="h-8 w-8 text-accent fill-current" />
          <span className="font-serif text-2xl font-bold tracking-tight">HeartEcho</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-lg font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <Link href="/vault" className="hover:text-primary transition-colors">My Vault</Link>
          <Link href="/archive" className="hover:text-primary transition-colors">Archive</Link>
          <Link href="/family" className="hover:text-primary transition-colors">Family Room</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="hidden sm:flex text-muted-foreground hover:text-primary">
            <Globe className="h-6 w-6" />
            <span className="sr-only">Language</span>
          </Button>
          <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg rounded-full px-6">
            Support Our Mission
          </Button>
        </div>
      </div>
    </header>
  );
}