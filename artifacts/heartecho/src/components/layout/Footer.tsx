import { Link } from "wouter";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto relative">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Heart className="h-8 w-8 text-accent fill-current" />
              <span className="font-serif text-3xl font-bold tracking-tight text-white">HeartEcho</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-sm text-lg">
              Preserving voices and stories. Creating a forever connection across generations.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-xl mb-4 text-white">Navigation</h4>
            <ul className="space-y-3 text-lg text-primary-foreground/80">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/vault" className="hover:text-white transition-colors">My Vault</Link></li>
              <li><Link href="/archive" className="hover:text-white transition-colors">Archive</Link></li>
              <li><Link href="/family" className="hover:text-white transition-colors">Family Room</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-xl mb-4 text-white">Legal</h4>
            <ul className="space-y-3 text-lg text-primary-foreground/80">
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row items-center justify-between text-primary-foreground/70">
          <p>100% Data Encryption Guarantee. Your data is never sold to third parties.</p>
          <p className="mt-4 md:mt-0">&copy; {new Date().getFullYear()} HeartEcho. All rights reserved.</p>
        </div>
      </div>
      
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="h-16 w-16 rounded-full shadow-xl bg-accent text-accent-foreground hover:bg-accent/90">
          <MessageCircle className="h-8 w-8" />
          <span className="sr-only">Need Help?</span>
        </Button>
      </div>
    </footer>
  );
}