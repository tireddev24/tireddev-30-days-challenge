import { Router } from "express";
import {
  signup,
  getUsers,
  deleteUser,
  updateUser,
  verifyEmail,
  generateOtp,
} from "../controllers/user.controller";

const userRoutes: Router = Router();

userRoutes.post("/signup", signup);

userRoutes.get("/otp", generateOtp);

userRoutes.post("/verify/:id", verifyEmail);

userRoutes.post("/updateuser/:id", updateUser);

userRoutes.get("/getusers", getUsers);

userRoutes.delete("/deleteuser/:id", deleteUser);

export default userRoutes;
