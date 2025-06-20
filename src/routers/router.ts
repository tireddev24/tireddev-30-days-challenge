import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import postRoutes from "./post.route";
import followRoutes from "./follower.route";
const router: Router = Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/post", postRoutes);

router.use("/follow", followRoutes);

export default router;
