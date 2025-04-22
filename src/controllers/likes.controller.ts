import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const likePost = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.user!;
  const postId = req.params.id;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const existingLike = await prisma.likes.findFirst({
      where: {
        usersId: id,
        postsId: postId,
      },
    });

    if (existingLike) {
      res.status(400).json({
        success: false,
        message: "You have already liked this post",
      });
      return;
    }

    await prisma.likes.create({
      data: {
        usersId: id,
        postsId: postId,
      },
    });

    res.status(200).json({
      success: true,
      message: "Liked post successfully",
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const unlikePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user!;
  const postId = req.params.id;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const existingLike = await prisma.likes.findFirst({
      where: {
        usersId: id,
        postsId: postId,
      },
    });

    if (!existingLike) {
      res.status(400).json({
        success: false,
        message: "You have not liked this post yet",
      });
      return;
    }

    await prisma.likes.delete({
      where: {
        id: existingLike.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "You unliked this post.",
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
