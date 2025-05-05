import { Request, Response } from "express";
import { compare } from "bcrypt";
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

    if (!compare(userPassword, user.password)) {
      res.status(400).json({ success: false, message: "Invalid Credentials" });
      return;
    }

    const { password, ...userData } = user;
    const token = sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("tk", token, {
      maxAge: 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: userData,
      token,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const logout = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  if (!userId) {
    res.status(400).json({
      success: false,
      message: "You cannot logout while not logged in",
    });
    return;
  }
  try {
    res.clearCookie("tk");

    res.status(200).json({ success: true, message: "Logged out successfully" });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: true, message: "Server Error" });
    return;
  }
};
