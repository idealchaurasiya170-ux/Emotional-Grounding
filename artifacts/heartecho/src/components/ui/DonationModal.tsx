import { X, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DonationModal({ open, onClose }: DonationModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Support HeartEcho Mission"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-white/10">

        {/* ── HEADER ── */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-7 pt-7 pb-6 shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-lg">
              <Heart className="w-8 h-8 text-amber-400 fill-amber-400/30" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-white leading-tight">
              Support the HeartEcho Mission
            </h2>
            <p className="text-base text-white/70 max-w-sm leading-relaxed">
              Help us preserve ancestral voices and connect generations. Every contribution funds free vaults for families who cannot afford them.
            </p>
          </div>

          {/* Suggested amounts */}
          <div className="flex items-center justify-center gap-3 mt-5">
            {["$5", "$15", "$25", "$50"].map((amt) => (
              <button
                key={amt}
                className="px-4 py-2 rounded-full border border-amber-400/40 text-amber-300 text-sm font-semibold hover:bg-amber-400/15 hover:border-amber-400/70 transition-all"
              >
                {amt}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="bg-[#0F172A] px-7 py-7 space-y-4">

          {/* Stripe button */}
          <a
            href="https://buy.stripe.com/mock_donation_link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 text-white font-bold text-lg transition-all hover:brightness-110 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: "#635BFF" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white shrink-0" aria-hidden="true">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
            </svg>
            Donate via Stripe
            <ExternalLink className="w-4 h-4 opacity-60 shrink-0" />
          </a>

          {/* PayPal button */}
          <a
            href="https://www.paypal.com/donate/mock_link"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full rounded-2xl px-6 py-4 font-bold text-lg transition-all hover:brightness-105 hover:-translate-y-0.5 active:scale-[0.98] shadow-lg"
            style={{ backgroundColor: "#FFC439", color: "#003087" }}
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
              <path fill="#003087" d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .923-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.777-4.471z"/>
            </svg>
            Donate via PayPal
            <ExternalLink className="w-4 h-4 opacity-50 shrink-0" />
          </a>

          {/* Trust note */}
          <p className="text-center text-xs text-white/35 leading-relaxed pt-1">
            HeartEcho Foundation Trust is a registered non-profit. All donations fund free memory vaults for low-income families. Tax receipt available on request.
          </p>
        </div>

        {/* ── FOOTER ── */}
        <div className="bg-[#0F172A] border-t border-white/10 px-7 py-4 shrink-0 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <Heart className="w-4 h-4 text-amber-400/60 fill-amber-400/30 shrink-0" />
            <span>Thank you for keeping stories alive.</span>
          </div>
          <Button
            onClick={onClose}
            variant="outline"
            className="rounded-full border-white/20 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/30 bg-transparent shrink-0"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
