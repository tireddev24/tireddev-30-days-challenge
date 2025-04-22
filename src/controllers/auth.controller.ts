import { Request, Response } from "express";
import { compareSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../secrets";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email: userEmail, password: userPassword } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: { email: userEmail },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "Invalid Credentials" });
      return;
    }

    if (!compareSync(userPassword, user.password)) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
      return;
    }

    const { password, ...userData } = user;
    const token = sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "600s",
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json("Server Error");
  }
};
