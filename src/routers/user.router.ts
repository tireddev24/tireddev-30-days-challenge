import { Router } from "express";
import {
  signup,
  getUsers,
  deleteUser,
  updateUser,
  verifyEmail,
  generateOtp,
} from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth";

const userRoutes: Router = Router();

userRoutes.get("/getusers", getUsers);

userRoutes.get("/otp", verifyJWT, generateOtp);

userRoutes.post("/signup", signup);

userRoutes.post("/verify/:id", verifyJWT, verifyEmail);

userRoutes.post("/updateuser/:id", verifyJWT, updateUser);

userRoutes.delete("/deleteuser/:id", verifyJWT, deleteUser);

export default userRoutes;
