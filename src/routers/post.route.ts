import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getUsersPosts,
  sharePost,
  updatePost,
} from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.use(verifyJWT);

router.get("/getall", getPosts);

router.get("/getusersposts", getUsersPosts);

router.get("/share/:id", sharePost);

router.post("/createpost", createPost);

router.put("/updatepost/:id", updatePost);

router.delete("/deletepost/:id", deletePost);

export default router;
