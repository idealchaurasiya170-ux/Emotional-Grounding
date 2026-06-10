import { Router, type IRouter } from "express";
import { db, promptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  GetCurrentPromptResponse,
  ListPromptsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/prompts/current", async (req, res): Promise<void> => {
  const [prompt] = await db.select().from(promptsTable).where(eq(promptsTable.isActive, true)).limit(1);
  if (!prompt) {
    const [fallback] = await db.select().from(promptsTable).limit(1);
    if (!fallback) {
      res.status(404).json({ error: "No prompts found" });
      return;
    }
    res.json(GetCurrentPromptResponse.parse(fallback));
    return;
  }
  res.json(GetCurrentPromptResponse.parse(prompt));
});

router.get("/prompts", async (req, res): Promise<void> => {
  const prompts = await db.select().from(promptsTable).orderBy(promptsTable.weekNumber);
  res.json(ListPromptsResponse.parse(prompts));
});

export default router;
