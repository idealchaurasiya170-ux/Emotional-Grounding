import { useState } from "react";
import { UploadCloud, FileAudio, Image as ImageIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitQuestionnaire } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

export default function Archive() {
  const { toast } = useToast();
  const submitQuestionnaire = useSubmitQuestionnaire();
  
  const [formData, setFormData] = useState({
    birthYear: "",
    occupation: "",
    hometown: "",
    personality: "",
    favoriteFoods: "",
    traditions: "",
    lifePhilosophy: "",
    memorableStories: ""
  });

  const handleUpload = (type: string) => {
    toast({ title: `Uploading ${type}...`, description: "Simulating file upload to secure vault." });
  };

  const handleSubmit = async () => {
    try {
      await submitQuestionnaire.mutateAsync({
        data: {
          profileId: 1, // Demo ID
          birthYear: parseInt(formData.birthYear) || undefined,
          occupation: formData.occupation,
          hometown: formData.hometown,
          personality: formData.personality,
          favoriteFoods: formData.favoriteFoods,
          traditions: formData.traditions,
          lifePhilosophy: formData.lifePhilosophy,
          memorableStories: formData.memorableStories
        }
      });
      toast({ title: "Historical Questionnaire Saved", description: "The legacy has been securely preserved." });
    } catch (e) {
      toast({ title: "Error saving questionnaire", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-12">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl font-serif text-primary mb-4">Archive Portal</h1>
        <p className="text-xl text-muted-foreground">
          Preserve the memory of those who have passed. Upload historical photos, old audio clips, and document their life story to create a lasting Digital Portrait.
        </p>
      </div>

      {/* Upload Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-border border-dashed border-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => handleUpload('photos')}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <ImageIcon className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Historical Photos</h3>
            <p className="text-lg text-muted-foreground mb-6">Upload 5-10 cherished photos</p>
            <Button variant="outline" className="text-lg rounded-full px-8 border-primary text-primary">Browse Files</Button>
          </CardContent>
        </Card>

        <Card className="border-border border-dashed border-2 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" onClick={() => handleUpload('audio')}>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
              <FileAudio className="w-10 h-10 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Voice Snippet</h3>
            <p className="text-lg text-muted-foreground mb-6">Upload old voicemails or recordings</p>
            <Button variant="outline" className="text-lg rounded-full px-8 border-accent text-accent">Browse Audio</Button>
          </CardContent>
        </Card>
      </div>

      {/* Questionnaire */}
      <Card className="shadow-lg border-border">
        <CardHeader className="border-b pb-8 bg-card">
          <CardTitle className="text-3xl font-serif text-primary">Historical Questionnaire</CardTitle>
          <CardDescription className="text-xl">Document the details that made their life unique.</CardDescription>
        </CardHeader>
        <CardContent className="pt-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label className="text-xl text-primary font-medium">Birth Year</Label>
              <Input className="text-lg p-6 bg-background" placeholder="e.g. 1942" value={formData.birthYear} onChange={(e) => setFormData({...formData, birthYear: e.target.value})} />
            </div>
            <div className="space-y-3">
              <Label className="text-xl text-primary font-medium">Hometown</Label>
              <Input className="text-lg p-6 bg-background" placeholder="City, State" value={formData.hometown} onChange={(e) => setFormData({...formData, hometown: e.target.value})} />
            </div>
            <div className="space-y-3">
              <Label className="text-xl text-primary font-medium">Primary Occupation</Label>
              <Input className="text-lg p-6 bg-background" placeholder="e.g. Teacher, Engineer" value={formData.occupation} onChange={(e) => setFormData({...formData, occupation: e.target.value})} />
            </div>
            <div className="space-y-3">
              <Label className="text-xl text-primary font-medium">Personality Traits</Label>
              <Input className="text-lg p-6 bg-background" placeholder="Warm, stubborn, hilarious..." value={formData.personality} onChange={(e) => setFormData({...formData, personality: e.target.value})} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xl text-primary font-medium">Favorite Foods / Recipes</Label>
              <Input className="text-lg p-6 bg-background" placeholder="Sunday pot roast, lemon pie..." value={formData.favoriteFoods} onChange={(e) => setFormData({...formData, favoriteFoods: e.target.value})} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xl text-primary font-medium">Family Traditions</Label>
              <Textarea className="text-lg min-h-[100px] p-6 bg-background" placeholder="Describe traditions they started or kept alive..." value={formData.traditions} onChange={(e) => setFormData({...formData, traditions: e.target.value})} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xl text-primary font-medium">Life Philosophy</Label>
              <Textarea className="text-lg min-h-[100px] p-6 bg-background" placeholder="What advice did they always give?" value={formData.lifePhilosophy} onChange={(e) => setFormData({...formData, lifePhilosophy: e.target.value})} />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Label className="text-xl text-primary font-medium">Most Memorable Stories</Label>
              <Textarea className="text-lg min-h-[200px] p-6 bg-background" placeholder="Write down the stories everyone tells at Thanksgiving..." value={formData.memorableStories} onChange={(e) => setFormData({...formData, memorableStories: e.target.value})} />
            </div>
          </div>
          <div className="flex justify-end pt-6 border-t">
            <Button size="lg" className="text-xl px-12 py-8 rounded-full shadow-lg" onClick={handleSubmit}>
              <Save className="mr-3 w-6 h-6" /> Save Historical Record
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}