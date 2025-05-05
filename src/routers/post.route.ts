import { Router } from "express";
import {
  createPost,
  deletePost,
  getPosts,
  getUsersPosts,
  updatePost,
} from "../controllers/post.controller";

import postActionsRoutes from "./postactions.route";
import { verifyJWT } from "../middlewares/auth";
import { postLimit } from "../utils/limits";

const router: Router = Router();

router.get("/getall", getPosts);

router.post("/createpost", postLimit, verifyJWT, createPost);

router.use(verifyJWT);

router.get("/getusersposts", getUsersPosts);

router.put("/updatepost/:id", updatePost);

router.delete("/deletepost/:id", deletePost);

//routes for the actions that can performed on posts
router.use("/actions", postActionsRoutes);

export default router;
