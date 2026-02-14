import { Router } from "express";
import { login, callback } from "../controllers/auth.controller.js";

const router = Router();

router.get("/google", login);
router.get("/google/callback", callback);

export default router;
