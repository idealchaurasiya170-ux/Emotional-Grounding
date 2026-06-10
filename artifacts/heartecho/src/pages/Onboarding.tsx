import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useRegisterUser, useCreateNominee, useCreateProfile, useUpdateSubscription } from "@workspace/api-client-react";
import { ShieldCheck, Heart, Users, ChevronRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
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

  const handleNext = async () => {
    if (step === 1) {
      if (!name || !email || !password || !nominee1.name || !nominee2.name) {
        toast({ title: "Please fill all required fields", variant: "destructive" });
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
      } catch (e) {
        toast({ title: "Error creating account", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    } else if (step === 2) {
      setLoading(true);
      try {
        await subscriptionMutation.mutateAsync({ data: { subscriptionPlan: plan } });
        setStep(3);
      } catch (e) {
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
      } catch (e) {
        toast({ title: "Error creating profile", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-colors ${step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
              {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
            </div>
            <span className={`mt-3 text-sm font-medium ${step >= s ? 'text-primary' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Security' : s === 2 ? 'Role Choice' : 'Profile'}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-border shadow-lg">
        {step === 1 && (
          <>
            <CardHeader className="text-center pb-8">
              <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-serif text-primary">Secure Your Legacy</CardTitle>
              <CardDescription className="text-lg">
                Your account details and emergency contacts. We use a 15-30 day inactive check-in system to ensure your stories are safe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Your Account</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-lg">Full Name</Label>
                    <Input className="text-lg p-6" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-lg">Email</Label>
                    <Input type="email" className="text-lg p-6" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-lg">Password</Label>
                    <Input type="password" className="text-lg p-6" value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold border-b pb-2">Emergency Nominees</h3>
                <p className="text-muted-foreground mb-4">Who should we contact if your account is inactive?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4 bg-muted/50 p-6 rounded-xl">
                    <Label className="text-lg font-semibold text-primary">Nominee 1</Label>
                    <Input className="text-lg p-6" placeholder="Name" value={nominee1.name} onChange={e => setNominee1({ ...nominee1, name: e.target.value })} />
                    <Input type="email" className="text-lg p-6" placeholder="Email" value={nominee1.email} onChange={e => setNominee1({ ...nominee1, email: e.target.value })} />
                    <Input type="tel" className="text-lg p-6" placeholder="Phone" value={nominee1.phone} onChange={e => setNominee1({ ...nominee1, phone: e.target.value })} />
                  </div>
                  <div className="space-y-4 bg-muted/50 p-6 rounded-xl">
                    <Label className="text-lg font-semibold text-primary">Nominee 2</Label>
                    <Input className="text-lg p-6" placeholder="Name" value={nominee2.name} onChange={e => setNominee2({ ...nominee2, name: e.target.value })} />
                    <Input type="email" className="text-lg p-6" placeholder="Email" value={nominee2.email} onChange={e => setNominee2({ ...nominee2, email: e.target.value })} />
                    <Input type="tel" className="text-lg p-6" placeholder="Phone" value={nominee2.phone} onChange={e => setNominee2({ ...nominee2, phone: e.target.value })} />
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="text-center pb-8">
              <Users className="w-16 h-16 text-primary mx-auto mb-4" />
              <CardTitle className="text-3xl font-serif text-primary">Choose Your Path</CardTitle>
              <CardDescription className="text-lg">How are you using HeartEcho today?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup value={plan} onValueChange={(v: any) => setPlan(v)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <RadioGroupItem value="saving_phase" id="plan-living" className="peer sr-only" />
                  <Label htmlFor="plan-living" className="flex flex-col h-full border-2 border-muted bg-card hover:bg-accent/5 hover:border-accent p-8 rounded-2xl cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 transition-all">
                    <span className="text-2xl font-serif text-primary mb-2">Living Elder</span>
                    <span className="text-lg text-muted-foreground mb-6">I am setting this up for a living parent or grandparent to record stories.</span>
                    <div className="mt-auto">
                      <span className="text-3xl font-bold text-primary">$3.99</span>
                      <span className="text-lg text-muted-foreground">/mo</span>
                      <p className="text-sm font-medium text-accent mt-2">Saving Phase</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="legacy_connected" id="plan-ancestor" className="peer sr-only" />
                  <Label htmlFor="plan-ancestor" className="flex flex-col h-full border-2 border-muted bg-card hover:bg-accent/5 hover:border-accent p-8 rounded-2xl cursor-pointer peer-data-[state=checked]:border-accent peer-data-[state=checked]:bg-accent/10 transition-all">
                    <span className="text-2xl font-serif text-primary mb-2">Deceased Ancestor</span>
                    <span className="text-lg text-muted-foreground mb-6">I want to preserve the legacy of a deceased ancestor with photos and records.</span>
                    <div className="mt-auto">
                      <span className="text-3xl font-bold text-primary">$19.99</span>
                      <span className="text-lg text-muted-foreground">/mo</span>
                      <p className="text-sm font-medium text-accent mt-2">Legacy Connected Phase</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
              
              <div className="mt-12 text-center bg-muted/30 p-6 rounded-xl">
                <p className="text-lg text-muted-foreground mb-4">Secure Subscription Billing</p>
                <div className="flex items-center justify-center gap-4 text-muted-foreground">
                  <div className="h-10 px-4 bg-background border rounded flex items-center font-bold tracking-wider">STRIPE</div>
                  <div className="h-10 px-4 bg-background border rounded flex items-center font-bold tracking-wider italic">PayPal</div>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader className="text-center pb-8">
              <Heart className="w-16 h-16 text-primary mx-auto mb-4 fill-primary/10" />
              <CardTitle className="text-3xl font-serif text-primary">Memory Profile</CardTitle>
              <CardDescription className="text-lg">Tell us about the person whose legacy we are preserving.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xl">Senior's Name</Label>
                <Input className="text-lg p-6" value={seniorName} onChange={e => setSeniorName(e.target.value)} placeholder="Robert Smith" />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">Hometown</Label>
                <Input className="text-lg p-6" value={hometown} onChange={e => setHometown(e.target.value)} placeholder="Chicago, IL" />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">Favorite Things</Label>
                <Textarea className="text-lg min-h-[120px] p-6" value={favoriteThings} onChange={e => setFavoriteThings(e.target.value)} placeholder="Gardening, classical music, Sunday roasts..." />
              </div>
              <div className="space-y-2">
                <Label className="text-xl">Life Mantra / Philosophy</Label>
                <Input className="text-lg p-6" value={lifeMantra} onChange={e => setLifeMantra(e.target.value)} placeholder="Always look on the bright side." />
              </div>
            </CardContent>
          </>
        )}

        <div className="p-6 md:p-8 bg-muted/20 border-t flex justify-end">
          <Button onClick={handleNext} disabled={loading} size="lg" className="text-xl px-12 py-8 rounded-full">
            {loading ? "Processing..." : step === 3 ? "Complete Profile" : "Continue"}
            {!loading && <ChevronRight className="ml-2 w-6 h-6" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}