import { Router, type IRouter } from "express";
import { db, profilesTable, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateProfileBody,
  GetProfileParams,
  GetProfileResponse,
  UpdateProfileParams,
  UpdateProfileBody,
  UpdateProfileResponse,
  ListProfilesResponse,
  GetProfileBadgesParams,
  GetProfileBadgesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const toProfileResponse = (p: typeof profilesTable.$inferSelect) => ({
  ...p,
  createdAt: p.createdAt.toISOString(),
  photoUrl: p.photoUrl ?? null,
  voiceSnippetUrl: p.voiceSnippetUrl ?? null,
});

router.get("/profiles", async (req, res): Promise<void> => {
  const profiles = await db.select().from(profilesTable).orderBy(profilesTable.createdAt);
  res.json(ListProfilesResponse.parse(profiles.map(toProfileResponse)));
});

router.post("/profiles", async (req, res): Promise<void> => {
  const parsed = CreateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [user] = await db.select().from(usersTable).limit(1);
  if (!user) {
    res.status(404).json({ error: "No user found" });
    return;
  }
  const [profile] = await db.insert(profilesTable).values({
    ...parsed.data,
    userId: user.id,
  }).returning();
  res.status(201).json(GetProfileResponse.parse(toProfileResponse(profile)));
});

router.get("/profiles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProfileParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(GetProfileResponse.parse(toProfileResponse(profile)));
});

router.patch("/profiles/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateProfileParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProfileBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [profile] = await db.update(profilesTable)
    .set(parsed.data)
    .where(eq(profilesTable.id, params.data.id))
    .returning();
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(UpdateProfileResponse.parse(toProfileResponse(profile)));
});

router.get("/profiles/:id/badges", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProfileBadgesParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, params.data.id));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  const total = profile.storyCount;
  const gold = Math.floor(total / 50);
  const silver = Math.floor((total % 50) / 10);
  const bronze = Math.floor((total % 10) / 3);
  const milestones: { label: string; achievedAt: string; badgeTier: string }[] = [];
  if (total >= 3) milestones.push({ label: "First Stories Recorded", achievedAt: profile.createdAt.toISOString(), badgeTier: "bronze" });
  if (total >= 10) milestones.push({ label: "10 Memories Preserved", achievedAt: profile.createdAt.toISOString(), badgeTier: "silver" });
  if (total >= 50) milestones.push({ label: "50 Echoes Forever", achievedAt: profile.createdAt.toISOString(), badgeTier: "gold" });
  res.json(GetProfileBadgesResponse.parse({
    profileId: params.data.id,
    goldBadges: gold,
    silverBadges: silver,
    bronzeBadges: bronze,
    totalStories: total,
    currentStreak: Math.min(total, 7),
    milestones,
  }));
});

export default router;
