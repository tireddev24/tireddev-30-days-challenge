import { Router } from "express";
import authRoutes from "./auth.router";
import userRoutes from "./user.router";

const router: Router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

export default router;
