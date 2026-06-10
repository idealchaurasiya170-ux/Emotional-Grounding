import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  RegisterUserBody,
  GetMeResponse,
  UpdateSubscriptionBody,
  UpdateSubscriptionResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/users/me", async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(404).json({ error: "No user found" });
    return;
  }
  res.json(GetMeResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.post("/users/register", async (req, res): Promise<void> => {
  const parsed = RegisterUserBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { name, email, password } = parsed.data;
  const [user] = await db.insert(usersTable).values({
    name,
    email,
    passwordHash: password,
    language: parsed.data.language ?? "en",
  }).returning();
  res.status(201).json(GetMeResponse.parse({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));
});

router.patch("/users/subscription", async (req, res): Promise<void> => {
  const parsed = UpdateSubscriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(404).json({ error: "No user found" });
    return;
  }
  const price = parsed.data.subscriptionPlan === "legacy_connected" ? "19.99" : "3.99";
  const [updated] = await db.update(usersTable)
    .set({ subscriptionPlan: parsed.data.subscriptionPlan, subscriptionPrice: price })
    .where(eq(usersTable.id, user.id))
    .returning();
  res.json(UpdateSubscriptionResponse.parse({
    ...updated,
    createdAt: updated.createdAt.toISOString(),
  }));
});

export default router;
