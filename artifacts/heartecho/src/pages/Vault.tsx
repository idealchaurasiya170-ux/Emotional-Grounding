import { useState } from "react";
import { Mic, CircleStop, Triangle, Plus, Trash2, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetCurrentPrompt, useGetProfileBadges, useListRecordings, useDeleteRecording } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function Vault() {
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  // Using arbitrary profile ID 1 for demonstration
  const { data: currentPrompt } = useGetCurrentPrompt();
  const { data: badges } = useGetProfileBadges(1);
  const { data: recordings, refetch } = useListRecordings({ profileId: 1 });
  const deleteRecording = useDeleteRecording();

  const handleRecordToggle = () => {
    setIsRecording(!isRecording);
    if (isRecording) {
      toast({ title: "Recording saved securely to your Vault." });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteRecording.mutateAsync({ id });
      toast({ title: "Recording deleted." });
      refetch();
    } catch (e) {
      toast({ title: "Error deleting recording", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6 space-y-12">
      {/* Centerpiece Recorder */}
      <div className="flex flex-col items-center justify-center py-16 bg-card rounded-3xl shadow-sm border border-border">
        <h2 className="text-3xl font-serif text-primary mb-12">Tap to start your story</h2>
        <button
          onClick={handleRecordToggle}
          className={`w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl ${
            isRecording 
            ? "bg-destructive text-destructive-foreground animate-pulse shadow-destructive/50" 
            : "bg-accent text-accent-foreground hover:scale-105 hover:bg-accent/90 shadow-accent/20"
          }`}
        >
          {isRecording ? <CircleStop className="w-20 h-20" /> : <Mic className="w-20 h-20" />}
        </button>
        <p className="mt-8 text-xl text-muted-foreground font-medium">
          {isRecording ? "Recording in progress... Tap to stop" : "Ready to record"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Prompt */}
        <Card className="shadow-md border-border bg-primary/5">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary flex items-center gap-3">
              <Mic className="w-6 h-6 text-accent" />
              This Week's Prompt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium text-foreground leading-relaxed">
              {currentPrompt?.question || "What is a tradition from your childhood that you still cherish today?"}
            </p>
            <div className="mt-6 flex items-center justify-between text-muted-foreground">
              <span className="text-lg">Category: {currentPrompt?.category || "Childhood"}</span>
              <span className="text-lg px-4 py-1 bg-background rounded-full border">Week {currentPrompt?.weekNumber || 1}</span>
            </div>
          </CardContent>
        </Card>

        {/* Infinite Chapters / Badges */}
        <Card className="shadow-md border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-primary flex items-center gap-3">
              <Award className="w-6 h-6 text-accent" />
              Infinite Chapters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400 block mb-2">{badges?.goldBadges || 2}</span>
                <span className="text-lg font-medium text-amber-700 dark:text-amber-300">Gold</span>
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700">
                <span className="text-4xl font-bold text-slate-500 dark:text-slate-300 block mb-2">{badges?.silverBadges || 5}</span>
                <span className="text-lg font-medium text-slate-600 dark:text-slate-400">Silver</span>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-2xl border border-orange-200 dark:border-orange-800">
                <span className="text-4xl font-bold text-orange-600 dark:text-orange-400 block mb-2">{badges?.bronzeBadges || 12}</span>
                <span className="text-lg font-medium text-orange-700 dark:text-orange-300">Bronze</span>
              </div>
            </div>
            <p className="mt-6 text-center text-lg text-muted-foreground">
              Total Stories Told: <strong className="text-foreground">{badges?.totalStories || 19}</strong>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Special Days / Time Capsule */}
      <Card className="shadow-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary flex items-center gap-3">
            <Calendar className="w-6 h-6 text-accent" />
            Pre-Record for Special Days (Time Capsule)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-3">
              <Label className="text-lg">Occasion</Label>
              <Select defaultValue="birthday">
                <SelectTrigger className="text-lg h-14">
                  <SelectValue placeholder="Select Occasion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="birthday">Birthday</SelectItem>
                  <SelectItem value="anniversary">Anniversary</SelectItem>
                  <SelectItem value="holiday">Holiday</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label className="text-lg">Date to Unlock</Label>
              <Input type="date" className="text-lg h-14" />
            </div>
            <Button size="lg" className="h-14 text-lg">Schedule Recording</Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Echoes */}
      <Card className="shadow-md border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-primary">My Saved Echoes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-lg hover:bg-transparent">
                  <TableHead className="w-[300px]">Title</TableHead>
                  <TableHead>Chapter</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recordings?.map((rec) => (
                  <TableRow key={rec.id} className="text-lg">
                    <TableCell className="font-medium">{rec.title}</TableCell>
                    <TableCell className="text-muted-foreground">{rec.chapter}</TableCell>
                    <TableCell>{Math.floor(rec.durationSeconds / 60)}:{(rec.durationSeconds % 60).toString().padStart(2, '0')}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(rec.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full text-primary hover:text-primary hover:bg-primary/10">
                        <Triangle className="h-5 w-5 fill-current rotate-90" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-12 w-12 rounded-full text-secondary hover:text-secondary hover:bg-secondary/10">
                        <Plus className="h-6 w-6" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(rec.id)} className="h-12 w-12 rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!recordings?.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-12 text-xl text-muted-foreground">
                      No echoes saved yet. Tap the microphone above to begin your journey.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}