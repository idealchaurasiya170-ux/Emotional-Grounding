import { Router, type IRouter } from "express";
import { db, timeCapsulesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateTimeCapsuleBody,
  DeleteTimeCapsuleParams,
  ListTimeCapsulesQueryParams,
  ListTimeCapsulesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toTimeCapsuleResponse = (t: typeof timeCapsulesTable.$inferSelect) => ({
  ...t,
  createdAt: t.createdAt.toISOString(),
  audioUrl: t.audioUrl ?? null,
});

router.get("/timecapsules", async (req, res): Promise<void> => {
  const params = ListTimeCapsulesQueryParams.safeParse(req.query);
  let query = db.select().from(timeCapsulesTable).$dynamic();
  if (params.success && params.data.profileId) {
    query = query.where(eq(timeCapsulesTable.profileId, params.data.profileId));
  }
  const capsules = await query.orderBy(timeCapsulesTable.scheduledDate);
  res.json(ListTimeCapsulesResponse.parse(capsules.map(toTimeCapsuleResponse)));
});

router.post("/timecapsules", async (req, res): Promise<void> => {
  const parsed = CreateTimeCapsuleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [capsule] = await db.insert(timeCapsulesTable).values(parsed.data).returning();
  res.status(201).json(toTimeCapsuleResponse(capsule));
});

router.delete("/timecapsules/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTimeCapsuleParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db.delete(timeCapsulesTable).where(eq(timeCapsulesTable.id, params.data.id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Time capsule not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
