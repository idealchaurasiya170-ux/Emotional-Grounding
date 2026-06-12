import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import nomineesRouter from "./nominees";
import profilesRouter from "./profiles";
import recordingsRouter from "./recordings";
import timeCapsulesRouter from "./timecapsules";
import promptsRouter from "./prompts";
import archiveRouter from "./archive";
import sessionsRouter from "./sessions";
import dashboardRouter from "./dashboard";
import aiRouter from "./ai";
import notesRouter from "./notes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(nomineesRouter);
router.use(profilesRouter);
router.use(recordingsRouter);
router.use(timeCapsulesRouter);
router.use(promptsRouter);
router.use(archiveRouter);
router.use(sessionsRouter);
router.use(dashboardRouter);
router.use(aiRouter);
router.use(notesRouter);

export default router;
