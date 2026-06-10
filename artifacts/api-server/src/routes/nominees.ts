import { Router, type IRouter } from "express";
import { db, nomineesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateNomineeBody,
  DeleteNomineeParams,
  ListNomineesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/nominees", async (req, res): Promise<void> => {
  const nominees = await db.select().from(nomineesTable).orderBy(nomineesTable.createdAt);
  res.json(ListNomineesResponse.parse(nominees.map(n => ({
    ...n,
  }))));
});

router.post("/nominees", async (req, res): Promise<void> => {
  const parsed = CreateNomineeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(404).json({ error: "No user found" });
    return;
  }
  const [nominee] = await db.insert(nomineesTable).values({
    ...parsed.data,
    userId: user.id,
  }).returning();
  res.status(201).json(nominee);
});

router.delete("/nominees/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteNomineeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db.delete(nomineesTable).where(eq(nomineesTable.id, params.data.id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Nominee not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
