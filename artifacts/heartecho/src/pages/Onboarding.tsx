import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterUser, useCreateNominee, useCreateProfile, useUpdateSubscription } from "@workspace/api-client-react";
import { ShieldCheck, Heart, Users, ChevronRight, CheckCircle2, Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const registerMutation = useRegisterUser();
  const nomineeMutation = useCreateNominee();
  const subscriptionMutation = useUpdateSubscription();
  const profileMutation = useCreateProfile();

  // Step 1 State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nominee1, setNominee1] = useState({ name: "", email: "", phone: "" });
  const [nominee2, setNominee2] = useState({ name: "", email: "", phone: "" });

  // Step 2 State
  const [plan, setPlan] = useState<"saving_phase" | "legacy_connected">("saving_phase");

  // Step 3 State
  const [seniorName, setSeniorName] = useState("");
  const [hometown, setHometown] = useState("");
  const [favoriteThings, setFavoriteThings] = useState("");
  const [lifeMantra, setLifeMantra] = useState("");
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedPhoto(e.target?.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!name || !email || !password) {
        toast({ title: "Please enter your name, email and password to continue", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        await registerMutation.mutateAsync({
          data: { name, email, password, language: "en" }
        });
        await nomineeMutation.mutateAsync({ data: nominee1 });
        await nomineeMutation.mutateAsync({ data: nominee2 });
        setStep(2);
      } catch {
        toast({ title: "Error creating account", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setLoading(true);
      try {
        await subscriptionMutation.mutateAsync({ data: { subscriptionPlan: plan } });
        setStep(3);
      } catch {
        toast({ title: "Error setting plan", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else if (step === 3) {
      if (!seniorName || !hometown) {
        toast({ title: "Please provide the senior's name and hometown", variant: "destructive" });
        return;
      }
      setLoading(true);
      try {
        await profileMutation.mutateAsync({
          data: {
            seniorName,
            hometown,
            favoriteThings,
            lifeMantra,
            profileType: plan === "saving_phase" ? "living" : "ancestor"
          }
        });
        toast({ title: "Profile created successfully!" });
        setLocation(plan === "saving_phase" ? "/vault" : "/archive");
      } catch {
        toast({ title: "Error creating profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  const stepLabels = [t.onboarding.stepSecurity, t.onboarding.stepRole, t.onboarding.stepProfile];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Progress steps */}
      <div className="flex items-center mb-12">
        {[1, 2, 3].map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              <span className={`mt-3 text-sm font-medium whitespace-nowrap ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
                {stepLabels[i]}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-1 mx-3 rounded-full transition-colors ${step > s ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-border shadow-xl">
        {/* ── STEP 1: Security ── */}
        {step === 1 && (
          <>
            <CardHeader className="text-center pb-8">
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-serif text-primary">{t.onboarding.secureTitle}</CardTitle>
              <CardDescription className="text-lg">{t.onboarding.secureDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">{t.onboarding.yourAccount}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-lg">{t.onboarding.fullName}</Label>
                    <Input className="text-lg p-6" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">{t.onboarding.email}</Label>
                    <Input type="email" className="text-lg p-6" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-lg">{t.onboarding.password}</Label>
                    <Input type="password" className="text-lg p-6" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">{t.onboarding.emergencyNominees}</h3>
                <p className="text-muted-foreground mb-4">{t.onboarding.nomineeDesc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: `${t.onboarding.nominee} 1`, state: nominee1, setState: setNominee1 },
                    { label: `${t.onboarding.nominee} 2`, state: nominee2, setState: setNominee2 },
                  ].map(({ label, state, setState }) => (
                    <div key={label} className="space-y-4 bg-muted/50 p-6 rounded-xl">
                      <Label className="text-lg font-semibold text-primary">{label}</Label>
                      <Input className="text-lg p-6" placeholder="Name" value={state.name} onChange={e => setState({ ...state, name: e.target.value })} />
                      <Input type="email" className="text-lg p-6" placeholder="Email" value={state.email} onChange={e => setState({ ...state, email: e.target.value })} />
                      <Input type="tel" className="text-lg p-6" placeholder="Phone" value={state.phone} onChange={e => setState({ ...state, phone: e.target.value })} />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* ── STEP 2: Role Choice ── */}
        {step === 2 && (
          <>
            <CardHeader className="text-center pb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-serif text-primary">{t.onboarding.chooseTitle}</CardTitle>
              <CardDescription className="text-lg">{t.onboarding.chooseDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={plan} onValueChange={(v: any) => setPlan(v)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RadioGroupItem value="saving_phase" id="plan-living" className="peer sr-only" />
                  <Label htmlFor="plan-living" className="flex flex-col h-full border-2 border-muted bg-card hover:bg-accent/5 hover:border-accent p-8 rounded-2xl cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 transition-all">
                    <span className="text-2xl font-serif text-primary mb-2">{t.onboarding.livingElder}</span>
                    <span className="text-lg text-muted-foreground mb-4">{t.onboarding.livingElderDesc}</span>
                    <ul className="text-sm text-muted-foreground space-y-1.5 mb-6">
                      <li className="flex items-center gap-2"><span className="text-accent font-bold">✓</span> Secure Voice Heritage Recording</li>
                      <li className="flex items-center gap-2"><span className="text-accent font-bold">✓</span> Unlimited AI Persona Chat Assistant Access</li>
                      <li className="flex items-center gap-2"><span className="text-accent font-bold">✓</span> 80 Legacy Talk-Time Minutes/mo</li>
                    </ul>
                    <div className="mt-auto">
                      <span className="text-3xl font-bold text-primary">$3.99</span>
                      <span className="text-lg text-muted-foreground">/mo</span>
                      <p className="text-sm font-medium text-accent mt-2">{t.onboarding.savingPhase}</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="legacy_connected" id="plan-ancestor" className="peer sr-only" />
                  <Label htmlFor="plan-ancestor" className="flex flex-col h-full border-2 border-muted bg-card hover:bg-accent/5 hover:border-accent p-8 rounded-2xl cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 transition-all">
                    <span className="text-2xl font-serif text-primary mb-2">{t.onboarding.ancestor}</span>
                    <span className="text-lg text-muted-foreground mb-6">{t.onboarding.ancestorDesc}</span>
                    <div className="mt-auto">
                      <span className="text-3xl font-bold text-primary">$19.99</span>
                      <span className="text-lg text-muted-foreground">/mo</span>
                      <p className="text-sm font-medium text-accent mt-2">{t.onboarding.legacyPhase}</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="mt-12 text-center bg-muted/30 p-6 rounded-xl">
                <p className="text-lg text-muted-foreground mb-4">{t.onboarding.billingSecure}</p>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="h-10 px-6 bg-background border-2 border-border rounded-lg flex items-center font-bold tracking-widest text-primary shadow-sm">
                    STRIPE
                  </div>
                  <div className="h-10 px-6 bg-background border-2 border-border rounded-lg flex items-center font-bold tracking-widest italic text-blue-600 shadow-sm">
                    PayPal
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* ── STEP 3: Memory Profile ── */}
        {step === 3 && (
          <>
            <CardHeader className="text-center pb-8">
              <Heart className="w-16 h-16 text-primary mx-auto mb-4 fill-primary/10" />
              <CardTitle className="text-3xl font-serif text-primary">{t.onboarding.profileTitle}</CardTitle>
              <CardDescription className="text-lg">{t.onboarding.profileDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xl">{t.onboarding.seniorName}</Label>
                <Input className="text-lg p-6" value={seniorName} onChange={e => setSeniorName(e.target.value)} placeholder="Robert Smith" />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">{t.onboarding.hometown}</Label>
                <Input className="text-lg p-6" value={hometown} onChange={e => setHometown(e.target.value)} placeholder="Chicago, IL" />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">{t.onboarding.favoriteThings}</Label>
                <Textarea className="text-lg min-h-[120px] p-6" value={favoriteThings} onChange={e => setFavoriteThings(e.target.value)} placeholder="Gardening, classical music, Sunday roasts..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">{t.onboarding.lifeMantra}</Label>
                <Input className="text-lg p-6" value={lifeMantra} onChange={e => setLifeMantra(e.target.value)} placeholder="Always look on the bright side." />
              </div>

              {/* Interactive Photo Upload Zone */}
              <div className="space-y-2">
                <Label className="text-xl">{t.onboarding.photoUpload}</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoFile(file);
                  }}
                />
                {uploadedPhoto ? (
                  /* Uploaded state */
                  <div className="relative border-2 border-accent bg-accent/5 rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <img
                      src={uploadedPhoto}
                      alt="Uploaded preview"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <p className="text-white font-semibold text-lg">Click to change</p>
                    </div>
                    <div className="absolute top-3 right-3 bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm font-semibold flex items-center gap-1.5 shadow">
                      <CheckCircle2 className="w-4 h-4" />
                      {t.onboarding.photoUploaded}
                    </div>
                    {uploadedFileName && (
                      <div className="absolute bottom-3 left-3 bg-background/90 text-foreground rounded-lg px-3 py-1.5 text-sm font-medium backdrop-blur-sm shadow">
                        {uploadedFileName}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Empty drop zone */
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragOver(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handlePhotoFile(file);
                    }}
                    className={`flex flex-col items-center justify-center gap-4 p-10 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                      isDragOver
                        ? "border-accent bg-accent/10 scale-[1.01]"
                        : "border-border bg-muted/30 hover:border-accent/60 hover:bg-accent/5"
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isDragOver ? "bg-accent/20" : "bg-muted"}`}>
                      {isDragOver ? (
                        <Upload className="w-8 h-8 text-accent" />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-foreground">{t.onboarding.photoDropLabel}</p>
                      <p className="text-base text-muted-foreground mt-1">{t.onboarding.photoDropHint}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}

        <div className="p-6 md:p-8 bg-muted/20 border-t flex justify-end">
          <Button onClick={handleNext} disabled={loading} size="lg" className="text-xl px-12 py-8 rounded-full">
            {loading
              ? t.onboarding.processing
              : step === 3
                ? t.onboarding.complete
                : t.onboarding.continue}
            {!loading && <ChevronRight className="ml-2 w-6 h-6" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}
