import { Router } from "express";
import * as testsController from "../controllers/testsController.js";

const router = Router();

router.post("/tests/reset-database", testsController.resetDatabase);
router.post("/tests/seed/recommendations", testsController.seedRecommendations);

export default router;
