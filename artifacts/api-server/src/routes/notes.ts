import { Router, type IRouter } from "express";
import { createClient } from "@supabase/supabase-js";

const router: IRouter = Router();

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL or SUPABASE_KEY is not set");
  return createClient(url, key);
}

router.get("/notes", async (req, res) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("heartecho_notes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;
    res.json(data ?? []);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch notes";
    req.log.error(err, "Supabase GET /notes error");
    res.status(500).json({ error: message });
  }
});

router.post("/notes", async (req, res) => {
  const { content } = req.body as { content?: string };
  if (!content?.trim()) {
    res.status(400).json({ error: "content is required" });
    return;
  }

  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("heartecho_notes")
      .insert({ content: content.trim() })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to save note";
    req.log.error(err, "Supabase POST /notes error");
    res.status(500).json({ error: message });
  }
});

router.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from("heartecho_notes").delete().eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete note";
    req.log.error(err, "Supabase DELETE /notes error");
    res.status(500).json({ error: message });
  }
});

export default router;
