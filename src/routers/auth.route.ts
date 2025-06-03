import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller";
import { loginLimit } from "../utils/limits";
import { verifyJWT } from "../middlewares/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", loginLimit, login);

authRoutes.post("/logout", verifyJWT, logout);

export default authRoutes;
