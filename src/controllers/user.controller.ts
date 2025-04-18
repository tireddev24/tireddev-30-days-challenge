import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaClient, PrismaPromise, otp } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
import { createOtp } from "../utils/helpers";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { password: user_password, email } = req.body;

  try {
    const UserExists = await prisma.users.findFirst({
      where: { email: email },
    });

    if (UserExists) {
      res.status(404).json({ success: false, message: "User already exist" });
    }

    const user = await prisma.users.create({
      data: { ...req.body, password: hashSync(user_password, 10) },
    });

    const { password, ...userData } = user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    const otp: string = createOtp();
    await prisma.otp.create({
      data: {
        otp: otp,
        usersId: user.id,
        expiryTime: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    res.status(201).json({
      success: true,
      message: "User Signed up successfully!",
      userData,
      token,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to signup user" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();
    res.status(302).json(users);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.users.delete({
      where: { id: id },
    });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      user,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const updateUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.status(200).json({
      success: true,
      message: "Updated user details",
      user: updateUser,
    });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to update user" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { otp } = req.body;

  try {
    const match = await prisma.otp.findUnique({
      where: { usersId: id, expiryTime: { gte: new Date() } },
    });

    if (!match) {
      res.json({
        success: false,
        message: "OTP expired. Request for a new OTP",
      });
      await prisma.otp.delete({
        where: { usersId: id },
      });
      return;
    }

    if (otp !== match?.otp) {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      return;
    }
    await prisma.users.update({
      where: { id: id },
      data: { isVerified: true },
    });
    res
      .status(200)
      .json({ success: true, message: "Email successfully verified" });
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to verify otp" });
  }
};

export const generateOtp = (req: Request, res: Response) => {
  const otp = createOtp();

  res.json(otp);
};
