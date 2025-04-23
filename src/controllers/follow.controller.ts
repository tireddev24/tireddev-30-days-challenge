import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();

export const followUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user!;
  const userIdToFollow = req.params.id;

  if (id === userIdToFollow) {
    res.status(400).json({
      success: false,
      message: "You cannot follow yourself",
    });
    return;
  }

  try {
    const userToFollow = await prisma.users.findUnique({
      where: { id: userIdToFollow },
    });

    if (!userToFollow) {
      res
        .status(404)
        .json({ success: false, message: "User to follow does not exist" });
      return;
    }

    const existingFollow = await prisma.followers.findFirst({
      where: {
        followerId: id,
        followingId: userIdToFollow,
      },
    });

    if (existingFollow) {
      res.status(400).json({
        success: false,
        message: "You are already following this user",
      });
      return;
    }

    await prisma.followers.create({
      data: {
        followerId: id,
        followingId: userIdToFollow,
      },
    });

    res.status(200).json({
      success: true,
      message: `You are now following ${userToFollow.firstname} `,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const unfollowUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user!;
  const userIdToUnfollow = req.params.id;

  try {
    const userToUnfollow = await prisma.users.findUnique({
      where: { id: userIdToUnfollow },
    });

    if (!userToUnfollow) {
      res
        .status(404)
        .json({ success: false, message: "User to unfollow does not exist" });
      return;
    }

    const existingFollow = await prisma.followers.findFirst({
      where: {
        followerId: id,
        followingId: userIdToUnfollow,
      },
    });

    if (!existingFollow) {
      res.status(400).json({
        success: false,
        message: "You are not following this user",
      });
      return;
    }

    await prisma.followers.delete({
      where: {
        followerId_followingId: {
          followerId: id,
          followingId: userIdToUnfollow,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: `You have unfollowed ${userToUnfollow.firstname}`,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
