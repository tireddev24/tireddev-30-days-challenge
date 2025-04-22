import { Router } from "express";
import { likePost, unlikePost } from "../controllers/likes.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.post("/addlike/:id", verifyJWT, likePost);

router.post("/unlike/:id", verifyJWT, unlikePost);

export default router;
