import { Router } from "express";
import { protect } from "../middlewares/auth.middleware";
import { generateQuestion } from "../controllers/ai.controller";

const router = Router();

router.post("/generate-questions", protect, generateQuestion);

export default router;
