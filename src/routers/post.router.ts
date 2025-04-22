import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getUsersPosts,
  updatePost,
} from "../controllers/post.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.get("/getall", verifyJWT, getPosts);

router.get("/getusersposts", verifyJWT, getUsersPosts);

router.post("/createpost", verifyJWT, createPost);

router.put("/updatepost/:id", verifyJWT, updatePost);

router.delete("/deletepost/:id", verifyJWT, deletePost);

export default router;
