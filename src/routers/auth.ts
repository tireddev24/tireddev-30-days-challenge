import { Router } from "express";
import { deleteUser, getUsers, signup } from "../controllers/auth";

const authRoutes: Router = Router();

authRoutes.post("/signup", signup);

authRoutes.get("/getusers", getUsers);

authRoutes.delete("/deleteuser/:id", deleteUser);

export default authRoutes;
