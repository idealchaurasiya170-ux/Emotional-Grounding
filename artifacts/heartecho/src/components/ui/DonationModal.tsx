import { X, Heart, Smartphone, Building2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
}

const BANK_DETAILS = {
  accountName: "HeartEcho Foundation Trust",
  accountNumber: "4082 6119 8833 0047",
  routingNumber: "021000021",
  ifsc: "HDFC0001234",
  swiftCode: "HDFCINBBXXX",
  bankName: "HDFC Bank / JPMorgan Chase",
};

const UPI_ID = "heartecho@hdfcbank";

export default function DonationModal({ open, onClose }: DonationModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!open) return null;

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

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
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden rounded-3xl shadow-2xl border border-white/10">

        {/* ── HEADER — deep navy gradient ── */}
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] px-7 pt-7 pb-6 shrink-0">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/70 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Icon + title */}
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
        <div className="bg-[#0F172A] flex-1 overflow-y-auto px-7 py-6 space-y-6">

          {/* ── UPI QR Section ── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Scan UPI QR Code</h3>
              <span className="ml-auto text-xs text-amber-400/80 font-medium bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">Instant</span>
            </div>

            {/* QR placeholder — premium framed box */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-44 h-44">
                {/* Corner decorators */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-400 rounded-tl-md" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-400 rounded-tr-md" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-400 rounded-bl-md" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-400 rounded-br-md" />
                {/* QR grid simulation */}
                <div className="absolute inset-3 grid grid-cols-7 grid-rows-7 gap-0.5 opacity-80">
                  {Array.from({ length: 49 }).map((_, i) => {
                    const corners = [0,1,2,7,8,14,6,13,42,48,47,46,41,40,35,34];
                    const isFilled = corners.includes(i) || Math.random() > 0.5;
                    return (
                      <div
                        key={i}
                        className={`rounded-sm ${isFilled ? "bg-white" : "bg-transparent"}`}
                      />
                    );
                  })}
                </div>
                {/* Center heart overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-9 h-9 rounded-lg bg-[#0F172A] flex items-center justify-center border border-amber-400/30">
                    <Heart className="w-5 h-5 text-amber-400 fill-amber-400/50" />
                  </div>
                </div>
              </div>

              {/* UPI ID copy row */}
              <div className="w-full flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-4 py-2.5">
                <span className="text-sm text-white/50 shrink-0 font-medium">UPI ID</span>
                <span className="flex-1 text-sm font-mono text-amber-300 truncate">{UPI_ID}</span>
                <button
                  onClick={() => copyToClipboard(UPI_ID, "upi")}
                  className="shrink-0 text-white/50 hover:text-amber-400 transition-colors"
                  aria-label="Copy UPI ID"
                >
                  {copiedField === "upi"
                    ? <Check className="w-4 h-4 text-green-400" />
                    : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* ── Bank Transfer Section ── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-400/15 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-base font-semibold text-white">Bank Transfer Details</h3>
              <span className="ml-auto text-xs text-white/40 font-medium bg-white/8 px-2.5 py-1 rounded-full border border-white/10">1–3 days</span>
            </div>

            <div className="space-y-2.5">
              {[
                { label: "Account Name", value: BANK_DETAILS.accountName, field: "name" },
                { label: "Account Number", value: BANK_DETAILS.accountNumber, field: "account" },
                { label: "Routing / ABA", value: BANK_DETAILS.routingNumber, field: "routing" },
                { label: "IFSC Code", value: BANK_DETAILS.ifsc, field: "ifsc" },
                { label: "SWIFT / BIC", value: BANK_DETAILS.swiftCode, field: "swift" },
                { label: "Bank", value: BANK_DETAILS.bankName, field: "bank" },
              ].map(({ label, value, field }) => (
                <div
                  key={field}
                  className="flex items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 group"
                >
                  <div className="min-w-0">
                    <p className="text-xs text-white/40 font-medium uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="text-sm font-mono text-white/90 truncate">{value}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(value, field)}
                    className="shrink-0 text-white/30 hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label={`Copy ${label}`}
                  >
                    {copiedField === field
                      ? <Check className="w-4 h-4 text-green-400" />
                      : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trust note */}
          <p className="text-center text-xs text-white/35 leading-relaxed px-2">
            HeartEcho Foundation Trust is a registered non-profit. All donations are used exclusively to fund free memory vaults for low-income families. Tax receipt available on request.
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
