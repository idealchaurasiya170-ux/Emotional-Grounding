import { Phone, Video, Download, Heart, Clock, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useGetDashboardSummary, useListSessions } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";

export default function Family() {
  const { data: summary } = useGetDashboardSummary();
  const { data: sessions } = useListSessions();

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-serif text-primary mb-2">Family Room</h1>
          <p className="text-xl text-muted-foreground">The central hub for your family's Forever Connection.</p>
        </div>
        
        {/* Stats Row */}
        <div className="flex flex-wrap gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
          <div className="px-4 border-r border-border last:border-0">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Recordings</p>
            <p className="text-2xl font-bold text-primary">{summary?.totalRecordings || 24}</p>
          </div>
          <div className="px-4 border-r border-border last:border-0">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Story Minutes</p>
            <p className="text-2xl font-bold text-primary">{summary?.totalStoriesMinutes || 156}m</p>
          </div>
          <div className="px-4">
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Capsules</p>
            <p className="text-2xl font-bold text-primary">{summary?.timeCapsulesPending || 3}</p>
          </div>
        </div>
      </div>

      {/* Call Modes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border shadow-lg overflow-hidden flex flex-col">
          <div className="bg-primary/5 p-8 flex-1 flex flex-col items-center justify-center min-h-[300px] border-b">
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-6">
              <Video className="w-16 h-16 text-primary" />
            </div>
            <h3 className="text-2xl font-serif text-primary font-bold">Video Connect</h3>
            <Badge variant="outline" className="mt-4 text-sm px-4 py-1 bg-background text-primary border-primary">
              {summary?.minutesIncluded || 80} Mins Monthly Included
            </Badge>
          </div>
          <CardContent className="p-6 bg-card">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-muted-foreground">Used this month:</span>
              <span className="text-xl font-bold text-foreground">{summary?.minutesUsedThisMonth || 45} mins</span>
            </div>
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 text-lg h-14 rounded-xl">Start Video Call</Button>
              <Button variant="outline" size="lg" className="flex-1 text-lg h-14 rounded-xl border-accent text-accent hover:bg-accent/10">Top-Up Minutes</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border shadow-lg overflow-hidden flex flex-col relative group">
          <div className="absolute inset-0 bg-accent/5 pointer-events-none transition-opacity opacity-0 group-hover:opacity-100"></div>
          <div className="bg-card p-8 flex-1 flex flex-col items-center justify-center min-h-[300px] border-b">
            {/* Pulse Portrait Placeholder */}
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping"></div>
              <div className="relative w-32 h-32 rounded-full bg-muted border-4 border-accent flex items-center justify-center overflow-hidden z-10 shadow-xl">
                 <img src="https://i.pravatar.cc/300?img=68" alt="Senior Portrait" className="w-full h-full object-cover" />
              </div>
            </div>
            <h3 className="text-2xl font-serif text-primary font-bold">Pulse Portrait Audio</h3>
            <Badge className="mt-4 text-sm px-4 py-1 bg-accent text-accent-foreground hover:bg-accent">
              Unlimited Audio Calls
            </Badge>
          </div>
          <CardContent className="p-6 bg-card flex items-center justify-center">
             <Button size="lg" className="w-full text-xl h-16 rounded-xl bg-primary hover:bg-primary/90 shadow-lg">
                <Phone className="mr-3 w-6 h-6" /> Connect Audio
             </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upgrades & Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Multi-User Banner */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl">
          <CardContent className="p-8 flex flex-col h-full justify-between">
            <div>
              <Users className="w-12 h-12 mb-6 text-accent" />
              <h3 className="text-2xl font-serif font-bold mb-3">Multi-User Access</h3>
              <p className="text-primary-foreground/80 text-lg mb-6 leading-relaxed">
                Invite siblings, grandchildren, and extended family to view the vault and participate in calls.
              </p>
            </div>
            <Button className="w-full bg-background text-primary hover:bg-background/90 text-lg h-14">
              Upgrade for $9.99/mo
            </Button>
          </CardContent>
        </Card>

        {/* Premium E-Book Package */}
        <Card className="bg-card border-border shadow-md col-span-1 lg:col-span-2 flex flex-col md:flex-row items-center">
          <div className="p-8 flex-1">
            <h3 className="text-2xl font-serif text-primary font-bold mb-3">Download Lifetime Biography</h3>
            <p className="text-lg text-muted-foreground mb-6">
              Receive a beautifully formatted PDF E-Book containing all transcribed stories, photos, and a complete downloadable Audio Vault ZIP file.
            </p>
            <div className="flex items-center gap-6">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14 rounded-full shadow-md">
                <Download className="mr-2 w-5 h-5" /> Purchase Package - $39
              </Button>
              <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">One-time fee</span>
            </div>
          </div>
          <div className="p-8 hidden md:block">
            <div className="w-32 h-40 bg-muted rounded border shadow-inner flex items-center justify-center transform rotate-6 hover:rotate-0 transition-transform">
              <span className="text-muted-foreground font-serif text-center px-4">The Story<br/>of Us</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Call History & Donation */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Card className="col-span-1 lg:col-span-3 shadow-sm border-border">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-primary flex items-center gap-2">
              <Clock className="w-5 h-5" /> Recent Connection History
            </CardTitle>
          </CardHeader>
          <CardContent>
             {sessions?.length ? (
               <div className="space-y-4">
                 {sessions.slice(0,5).map(session => (
                   <div key={session.id} className="flex justify-between items-center p-4 bg-muted/30 rounded-xl">
                     <div className="flex items-center gap-4">
                       <div className="w-12 h-12 rounded-full bg-background border flex items-center justify-center text-primary">
                         {session.sessionType === 'video' ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                       </div>
                       <div>
                         <p className="text-lg font-medium text-foreground capitalize">{session.sessionType} Call</p>
                         <p className="text-sm text-muted-foreground">{new Date(session.startedAt).toLocaleDateString()}</p>
                       </div>
                     </div>
                     <div className="text-lg font-bold text-foreground">
                       {session.durationMinutes} mins
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-lg text-muted-foreground py-8 text-center bg-muted/20 rounded-xl">
                 No recent calls. Start a connection today!
               </p>
             )}
          </CardContent>
        </Card>

        <Card className="bg-accent/10 border-accent/20 shadow-sm flex flex-col items-center justify-center text-center p-8">
          <Heart className="w-12 h-12 text-accent fill-current mb-4" />
          <h4 className="text-xl font-serif text-foreground font-bold mb-2">Support Our Mission</h4>
          <p className="text-muted-foreground mb-6">Help us provide free vaults to low-income families.</p>
          <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground text-lg rounded-full">
            Donate $5
          </Button>
        </Card>
      </div>

    </div>
  );
}