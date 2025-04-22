import { Router } from "express";
import authRoutes from "./auth.router";
import userRoutes from "./user.router";
import postRoutes from "./post.router";
import likeRoutes from "./likes.router";

const router: Router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/post", postRoutes);

router.use("/likes", likeRoutes);

export default router;
