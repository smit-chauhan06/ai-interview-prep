import { Router } from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", protect, async (req: any, res) => {
  res.json({
    message: "You are authenticated 🎉",
    userId: req.userId,
  });
});

export default router;
