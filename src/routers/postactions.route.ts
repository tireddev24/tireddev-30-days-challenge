import { Router } from "express";
import {
  addComment,
  deleteComment,
  dislikePost,
  likePost,
  sharePost,
  unlikePost,
} from "../controllers/postactions.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.use(verifyJWT);

router.post("/addlike/:id", likePost);

router.post("/unlike/:id", unlikePost);

router.post("/dislike/:id", dislikePost);

router.get("/share/:id", sharePost);

router.post("/addcomment/:id", addComment);

router.delete("/deletecomment/:id", deleteComment);

export default router;
