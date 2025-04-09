import { Router } from "express";
import { deleteUser, getUsers, login, signup } from "../controllers/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", signup);

authRoutes.post("/login", login);

authRoutes.get("/getusers", getUsers);

authRoutes.delete("/deleteuser/:id", deleteUser);

export default authRoutes;
