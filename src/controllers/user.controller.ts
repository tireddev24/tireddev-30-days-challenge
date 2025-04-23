import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import { sign } from "jsonwebtoken";
import { PrismaClient, PrismaPromise, otp } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
import { createOtp, sendMail } from "../utils/helpers";
import { login } from "./auth.controller";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { password: userPassword, email } = req.body;

  try {
    const userExists = await prisma.users.findFirst({
      where: { email: email },
    });

    if (userExists) {
      res.status(404).json({ success: false, message: "User already exist" });
    }

    const user = await prisma.users.create({
      data: { ...req.body, password: hashSync(userPassword, 10) },
    });

    const { password, ...userData } = user;
    const token = sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "300s",
    });

    login;

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

    sendMail(user.email, otp);
    return;
  } catch (error: any) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to signup user" });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.users.findMany({
      include: { follower: true, following: true },
    });

    if (!users) {
      res.status(404).json({ success: false, message: "No users found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      users: users.map((user) => ({
        ...user,
        followerCount: user.following.length,
        followingCount: user.follower.length,
      })),
    });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user!;
  try {
    const user = await prisma.users.findUnique({
      where: { id: id },
      include: { follower: true, following: true },
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.status(200).json({
      success: true,
      message: "User Info fetched successfully",
      user: {
        ...user,
        followerCount: user.following.length,
        followingCount: user.follower.length,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const otpExists = await prisma.otp.findUnique({
      where: { usersId: id },
    });
    if (otpExists) {
      await prisma.otp.delete({
        where: { usersId: id },
      });
    }

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

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
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

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { otp } = req.body;

  try {
    const isVerified = await prisma.users.findUnique({
      where: { id: req.user!.id },
    });
    if (isVerified?.isVerified) {
      res.status(400).json({
        success: false,
        message: "Email already verified",
      });
      return;
    }

    const match = await prisma.otp.findFirst({
      where: { usersId: req.user!.id, expiryTime: { gte: new Date() } },
    });

    if (!match) {
      res.json({
        success: false,
        message: "OTP expired. Request for a new OTP",
      });
      await prisma.otp.delete({
        where: { usersId: req.user!.id },
      });
      return;
    }

    if (otp !== match?.otp) {
      res.status(400).json({ success: false, message: "Invalid OTP" });
      return;
    }
    await prisma.users.update({
      where: { id: req.user!.id },
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

export const generateOtp = async (req: Request, res: Response) => {
  const otp = createOtp();

  try {
    const otpExists = await prisma.otp.findUnique({
      where: { usersId: req.user!.id },
    });
    if (otpExists?.expiryTime! > new Date()) {
      res.status(400).json({
        success: false,
        message: "Please try again after 10 minutes",
      });
      return;
    }
    await prisma.otp.create({
      data: {
        otp: otp,
        usersId: req.user!.id,
        expiryTime: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    res.status(200).json({
      success: true,
      message: "OTP generated successfully",
    });
  } catch (error) {}
};
