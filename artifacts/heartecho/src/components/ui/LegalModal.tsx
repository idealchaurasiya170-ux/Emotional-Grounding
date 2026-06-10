import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalModalProps {
  open: boolean;
  onClose: () => void;
  type: "terms" | "privacy";
}

const TERMS_CONTENT = `Terms of Service

Last Updated: June 10, 2026

1. ACCEPTANCE OF TERMS
By accessing or using the HeartEcho platform ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.

2. DESCRIPTION OF SERVICE
HeartEcho provides a digital legacy preservation platform that allows users to record, store, and share voice recordings, photographs, and written memories for personal and family use ("Digital Portrait", "Voice Heritage", "Forever Connection").

3. ELIGIBILITY
You must be at least 18 years of age to create an account. By creating an account on behalf of a senior family member, you confirm you have their informed consent or legal authority to do so.

4. USER ACCOUNTS
You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. HeartEcho is not liable for any loss resulting from unauthorized access to your account.

5. SUBSCRIPTION AND BILLING
HeartEcho offers subscription plans billed monthly. You authorize us to charge your payment method on a recurring basis. Subscriptions may be cancelled at any time; cancellation takes effect at the end of the current billing period. No partial refunds are issued for unused subscription time.

6. INACTIVE ACCOUNT PROTOCOL
If an account remains inactive for 15–30 days, HeartEcho will contact the designated Emergency Nominees you registered during onboarding. This protocol exists to protect your stored memories and ensure they are preserved according to your wishes.

7. DATA STORAGE AND RETENTION
All recordings, photos, and personal information are stored on encrypted servers. Upon account termination, data is retained for 90 days before permanent deletion, unless otherwise instructed by account nominees.

8. ACCEPTABLE USE
You agree not to upload content that is illegal, defamatory, or infringes third-party intellectual property rights. HeartEcho reserves the right to remove content that violates these terms without notice.

9. INTELLECTUAL PROPERTY
All memories, recordings, and content you upload remain your property. By uploading content, you grant HeartEcho a limited, non-exclusive licence to store, process, and display your content solely for the purpose of delivering the Service.

10. LIMITATION OF LIABILITY
HeartEcho's total liability to you for any claim arising from the use of the Service shall not exceed the total amount paid by you in the 12 months preceding the claim.

11. GOVERNING LAW
These terms are governed by the laws of the State of Delaware, USA. Any disputes shall be resolved exclusively in the courts of Delaware.

12. CHANGES TO TERMS
We reserve the right to modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the revised Terms.

Contact: legal@heartecho.com`;

const PRIVACY_CONTENT = `Privacy Policy

Last Updated: June 10, 2026

HeartEcho ("we", "our", "us") is committed to protecting the personal information of our users. This Privacy Policy explains how we collect, use, store, and protect your data.

1. INFORMATION WE COLLECT
Personal Information: Name, email address, phone number, billing information, and profile details you provide during registration and onboarding.
Content Data: Voice recordings, photographs, written memories, and other content you upload to the Service.
Usage Data: Log data, IP addresses, browser type, pages visited, and time spent on the Service.
Emergency Nominee Information: Names, email addresses, and phone numbers of individuals you designate as Emergency Nominees.

2. HOW WE USE YOUR INFORMATION
- To provide, operate, and improve the HeartEcho platform
- To process payments and manage your subscription
- To contact Emergency Nominees if your account is inactive for 15–30 days
- To send service updates, security alerts, and support messages
- To comply with legal obligations

3. DATA SHARING
We do NOT sell, rent, or trade your personal data to third parties.
We may share data with:
- Payment processors (Stripe, PayPal) solely for billing purposes
- Cloud storage providers under strict confidentiality agreements
- Legal authorities only when required by applicable law

4. DATA SECURITY
All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We conduct regular security audits and penetration testing. HeartEcho is fully compliant with GDPR, CCPA, and HIPAA guidelines where applicable.

5. YOUR RIGHTS
You have the right to:
- Access the personal data we hold about you
- Request correction of inaccurate data
- Request deletion of your account and associated data
- Object to processing of your data for marketing purposes
- Port your data in a machine-readable format

To exercise these rights, email: privacy@heartecho.com

6. DATA RETENTION
Your data is retained for as long as your account is active. Following account termination, data is retained for 90 days and then permanently deleted, unless preservation has been initiated by registered Emergency Nominees.

7. COOKIES
We use essential cookies to operate the Service and analytics cookies (with your consent) to understand usage patterns. You may disable non-essential cookies through your browser settings.

8. CHILDREN'S PRIVACY
The Service is not directed to individuals under 18. We do not knowingly collect personal information from minors.

9. CHANGES TO THIS POLICY
We will notify you of material changes via email or a prominent notice on the Service at least 30 days before the change takes effect.

10. CONTACT US
HeartEcho Data Privacy Team
privacy@heartecho.com
HeartEcho Inc., 1234 Legacy Lane, Wilmington, DE 19801, USA`;

export default function LegalModal({ open, onClose, type }: LegalModalProps) {
  if (!open) return null;

  const title = type === "terms" ? "Terms of Service" : "Privacy Policy";
  const content = type === "terms" ? TERMS_CONTENT : PRIVACY_CONTENT;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent/15 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">§</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-primary">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <pre className="whitespace-pre-wrap text-base text-foreground/90 leading-relaxed font-sans">
            {content}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 shrink-0 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">HeartEcho Inc. · legal@heartecho.com</p>
          <Button onClick={onClose} className="rounded-full px-8">
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
}
