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

const router: Router = Router();

router.use(verifyJWT);

router.get("/getall", getPosts);

router.get("/getusersposts", getUsersPosts);

router.post("/createpost", createPost);

router.put("/updatepost/:id", updatePost);

router.delete("/deletepost/:id", deletePost);

//routes for the actions that can performed on posts
router.use("/actions", postActionsRoutes);

export default router;
