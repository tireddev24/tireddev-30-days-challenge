import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { email: user_email, password: user_password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: { email: user_email },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "Invalid Credentials" });
      return;
    }

    if (!compareSync(user_password, user.password)) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
      return;
    }

    const { password, ...userData } = user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      userData,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};
