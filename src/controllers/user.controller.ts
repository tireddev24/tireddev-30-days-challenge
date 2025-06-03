import { Request, Response } from "express";
import { prisma } from "../server";
import { createOtp } from "../utils/helpers";

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
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
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
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
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
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
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
    return;
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Server Error: Unable to verify otp" });
    return;
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
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
