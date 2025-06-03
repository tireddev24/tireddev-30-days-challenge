import { Request, Response } from "express";
import { compareSync, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
import { createOtp, sendMail } from "../utils/helpers";

const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { password: userPassword, email } = req.body;

  try {
    const userExists = await prisma.users.findFirst({
      where: { email: email },
    });

    if (userExists) {
      res.status(400).json({ success: false, message: "User already exists" });
      return;
    }

    const user = await prisma.users.create({
      data: { ...req.body, password: hash(userPassword, 10) },
    });

    const { password, ...userData } = user;
    const token = sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    //create otp after user signs up
    const otp: string = createOtp();

    await prisma.otp.create({
      data: {
        otp: otp,
        usersId: user.id,
        expiryTime: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    sendMail(user.email, otp); //send otp to users mail

    res.status(201).json({
      success: true,
      message: "User Signed up successfully!",
      user: userData,
      token,
    });

    return;
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to signup user" });
    return;
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email: userEmail, password: userPassword } = req.body;

  try {
    const user = await prisma.users.findUnique({
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
