import { Router } from "express";
import {
  signup,
  getUsers,
  deleteUser,
  updateUser,
  verifyEmail,
  generateOtp,
  getUserInfo,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth";

const router: Router = Router();

router.post("/signup", signup);

router.get("/getusers", getUsers);

router.use(verifyJWT);

router.get("/otp", generateOtp);

router.get("/userinfo", getUserInfo);

router.post("/verify/:id", verifyEmail);

router.post("/updateuser/:id", updateUser);

router.delete("/deleteuser/:id", deleteUser);

export default router;
