import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, RefreshCw, Loader2, AlertCircle, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Note = {
  id: string;
  content: string;
  created_at: string;
};

async function fetchNotes(): Promise<Note[]> {
  const res = await fetch("/api/notes");
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to load notes");
  return data as Note[];
}

async function saveNote(content: string): Promise<Note> {
  const res = await fetch("/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed to save note");
  return data as Note;
}

async function deleteNote(id: string): Promise<void> {
  const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error((data as { error?: string }).error ?? "Failed to delete note");
  }
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [content, setContent] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);

  const load = useCallback(async () => {
    setLoadingNotes(true);
    setLoadError(null);
    try {
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoadingNotes(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!content.trim() || saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const note = await saveNote(content.trim());
      setNotes((prev) => [note, ...prev]);
      setContent("");
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2500);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch {
      // silently fail — note stays in list
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-md">
          <FileText className="w-6 h-6 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-primary">Supabase Notes</h1>
          <p className="text-sm text-muted-foreground">Save and load messages from Supabase · Real-time persistence</p>
        </div>
      </div>

      {/* Supabase connection status */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-sm">
            <div className={`w-2.5 h-2.5 rounded-full ${loadError ? "bg-red-500" : "bg-green-500"}`} />
            <span className="font-medium text-foreground">
              {loadError ? "Supabase connection issue" : "Connected to Supabase"}
            </span>
            <span className="text-muted-foreground ml-auto">Table: <code className="bg-muted px-1.5 py-0.5 rounded text-xs">heartecho_notes</code></span>
          </div>
        </CardContent>
      </Card>

      {/* Compose */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-serif text-primary flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" /> Save a Message to Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a memory, note, or message to save…"
            className="min-h-[100px] text-base resize-none"
            disabled={saving}
          />
          {saveError && (
            <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" /> {saveError}
            </div>
          )}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleSave}
              disabled={!content.trim() || saving}
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              {saving ? "Saving…" : "Save to Supabase"}
            </Button>
            {savedFlash && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-green-600">
                <CheckCircle2 className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-3 flex-row items-center justify-between">
          <CardTitle className="text-lg font-serif text-primary">
            Saved Messages {notes.length > 0 && <span className="text-accent text-base">({notes.length})</span>}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={load} disabled={loadingNotes} className="gap-2 text-muted-foreground hover:text-primary">
            <RefreshCw className={`w-4 h-4 ${loadingNotes ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {loadError && (
            <div className="flex items-start gap-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-4 mb-4">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Could not load notes from Supabase</p>
                <p className="text-destructive/80">{loadError}</p>
                <p className="mt-2 text-muted-foreground text-xs">
                  Make sure the <code className="bg-muted px-1 rounded">heartecho_notes</code> table exists in your Supabase project.
                  Run the SQL in the testing instructions to create it.
                </p>
              </div>
            </div>
          )}

          {loadingNotes ? (
            <div className="flex items-center justify-center py-12 text-muted-foreground gap-3">
              <Loader2 className="w-5 h-5 animate-spin" /> Loading from Supabase…
            </div>
          ) : notes.length === 0 && !loadError ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-base">No messages saved yet.</p>
              <p className="text-sm">Save your first message above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="flex items-start gap-4 p-4 bg-muted/30 hover:bg-muted/50 rounded-xl border border-border/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                      {note.content}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Delete note"
                  >
                    {deletingId === note.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
