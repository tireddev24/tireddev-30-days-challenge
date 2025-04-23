import { Router } from "express";
import {
  dislikePost,
  likePost,
  unlikePost,
} from "../controllers/likes.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.use(verifyJWT);

router.post("/addlike/:id", likePost);

router.post("/unlike/:id", unlikePost);

router.post("/dislike/:id", dislikePost);

export default router;
