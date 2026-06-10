import { Router, type IRouter } from "express";
import { db, recordingsTable, profilesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  CreateRecordingBody,
  GetRecordingParams,
  GetRecordingResponse,
  UpdateRecordingParams,
  UpdateRecordingBody,
  UpdateRecordingResponse,
  DeleteRecordingParams,
  ListRecordingsQueryParams,
  ListRecordingsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toRecordingResponse = (r: typeof recordingsTable.$inferSelect) => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
  audioUrl: r.audioUrl ?? null,
  promptId: r.promptId ?? null,
});

router.get("/recordings", async (req, res): Promise<void> => {
  const params = ListRecordingsQueryParams.safeParse(req.query);
  let query = db.select().from(recordingsTable).$dynamic();
  if (params.success && params.data.profileId) {
    query = query.where(eq(recordingsTable.profileId, params.data.profileId));
  }
  const recordings = await query.orderBy(recordingsTable.createdAt);
  res.json(ListRecordingsResponse.parse(recordings.map(toRecordingResponse)));
});

router.post("/recordings", async (req, res): Promise<void> => {
  const parsed = CreateRecordingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [recording] = await db.insert(recordingsTable).values(parsed.data).returning();
  await db.update(profilesTable)
    .set({ storyCount: sql`${profilesTable.storyCount} + 1` })
    .where(eq(profilesTable.id, parsed.data.profileId));
  res.status(201).json(GetRecordingResponse.parse(toRecordingResponse(recording)));
});

router.get("/recordings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetRecordingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [recording] = await db.select().from(recordingsTable).where(eq(recordingsTable.id, params.data.id));
  if (!recording) {
    res.status(404).json({ error: "Recording not found" });
    return;
  }
  res.json(GetRecordingResponse.parse(toRecordingResponse(recording)));
});

router.patch("/recordings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateRecordingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateRecordingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [recording] = await db.update(recordingsTable)
    .set(parsed.data)
    .where(eq(recordingsTable.id, params.data.id))
    .returning();
  if (!recording) {
    res.status(404).json({ error: "Recording not found" });
    return;
  }
  res.json(UpdateRecordingResponse.parse(toRecordingResponse(recording)));
});

router.delete("/recordings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteRecordingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db.delete(recordingsTable).where(eq(recordingsTable.id, params.data.id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Recording not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
