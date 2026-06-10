import { Router, type IRouter } from "express";
import { db, archiveItemsTable, questionnairesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateArchiveItemBody,
  SubmitQuestionnaireBody,
  ListArchiveItemsQueryParams,
  ListArchiveItemsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toArchiveResponse = (a: typeof archiveItemsTable.$inferSelect) => ({
  ...a,
  uploadedAt: a.uploadedAt.toISOString(),
  description: a.description ?? null,
});

router.get("/archive", async (req, res): Promise<void> => {
  const params = ListArchiveItemsQueryParams.safeParse(req.query);
  let query = db.select().from(archiveItemsTable).$dynamic();
  if (params.success && params.data.profileId) {
    query = query.where(eq(archiveItemsTable.profileId, params.data.profileId));
  }
  const items = await query.orderBy(archiveItemsTable.uploadedAt);
  res.json(ListArchiveItemsResponse.parse(items.map(toArchiveResponse)));
});

router.post("/archive", async (req, res): Promise<void> => {
  const parsed = CreateArchiveItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(archiveItemsTable).values(parsed.data).returning();
  res.status(201).json(toArchiveResponse(item));
});

router.post("/archive/questionnaire", async (req, res): Promise<void> => {
  const parsed = SubmitQuestionnaireBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [q] = await db.insert(questionnairesTable).values(parsed.data).returning();
  res.status(201).json({
    ...q,
    submittedAt: q.submittedAt.toISOString(),
  });
});

export default router;
