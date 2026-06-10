import { Router, type IRouter } from "express";
import { db, callSessionsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateSessionBody,
  ListSessionsQueryParams,
  ListSessionsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toSessionResponse = (s: typeof callSessionsTable.$inferSelect) => ({
  ...s,
  startedAt: s.startedAt.toISOString(),
});

router.get("/sessions", async (req, res): Promise<void> => {
  const params = ListSessionsQueryParams.safeParse(req.query);
  let query = db.select().from(callSessionsTable).$dynamic();
  if (params.success && params.data.profileId) {
    query = query.where(eq(callSessionsTable.profileId, params.data.profileId));
  }
  const sessions = await query.orderBy(callSessionsTable.startedAt);
  res.json(ListSessionsResponse.parse(sessions.map(toSessionResponse)));
});

router.post("/sessions", async (req, res): Promise<void> => {
  const parsed = CreateSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [session] = await db.insert(callSessionsTable).values(parsed.data).returning();
  res.status(201).json(toSessionResponse(session));
});

export default router;
