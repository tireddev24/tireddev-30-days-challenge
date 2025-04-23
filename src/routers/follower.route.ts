import { Router } from "express";

const router: Router = Router();

import { followUser, unfollowUser } from "../controllers/follow.controller";
import { verifyJWT } from "../middlewares/auth";

router.use(verifyJWT);

router.post("/followuser/:id", followUser);
router.post("/unfollowuser/:id", unfollowUser);

export default router;
