import { Router, type IRouter } from "express";
import { db, recordingsTable, profilesTable, timeCapsulesTable, callSessionsTable, usersTable } from "@workspace/db";
import { eq, sum, count } from "drizzle-orm";
import {
  GetDashboardSummaryResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const [user] = await db.select().from(usersTable).limit(1);
  const profiles = await db.select().from(profilesTable);
  const allRecordings = await db.select().from(recordingsTable).orderBy(recordingsTable.createdAt).limit(5);
  const capsules = await db.select().from(timeCapsulesTable).where(eq(timeCapsulesTable.isLocked, true));
  const sessions = await db.select().from(callSessionsTable);

  const totalRecordings = allRecordings.length;
  const totalStoriesMinutes = allRecordings.reduce((acc, r) => acc + Math.round(r.durationSeconds / 60), 0);
  const minutesUsed = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const recentRecordings = allRecordings.slice(-5).map(r => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    audioUrl: r.audioUrl ?? null,
    promptId: r.promptId ?? null,
  }));

  res.json(GetDashboardSummaryResponse.parse({
    totalRecordings,
    totalStoriesMinutes,
    activeProfiles: profiles.length,
    timeCapsulesPending: capsules.length,
    minutesUsedThisMonth: minutesUsed,
    minutesIncluded: 80,
    subscriptionPlan: user?.subscriptionPlan ?? "saving_phase",
    recentRecordings,
  }));
});

export default router;
