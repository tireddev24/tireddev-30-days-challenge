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
      message: "You liked this post ",
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

export const dislikePost = async (
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

    const existingDislike = await prisma.dislikes.findFirst({
      where: {
        usersId: id,
        postsId: postId,
      },
    });

    if (existingDislike) {
      res.status(400).json({
        success: false,
        message: "You have already disliked this post",
      });
      return;
    }

    await prisma.dislikes.create({
      data: {
        usersId: id,
        postsId: postId,
      },
    });

    res.status(200).json({
      success: true,
      message: "You disliked this post.",
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const sharePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.id;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Gotten Shared Post",
      post,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const addComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const postId = req.params.id;
  const { content } = req.body;

  try {
    const post = await prisma.posts.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const comment = await prisma.comments.findFirst({
      where: {
        postsId: postId,
        usersId: userId,
      },
    });

    if (comment) {
      res.status(400).json({
        success: false,
        message: "You have already commented on this post",
      });
      return;
    }

    if (!content) {
      res
        .status(400)
        .json({ success: false, message: "Comment content is required" });
      return;
    }

    await prisma.comments.create({
      data: {
        content: content,
        usersId: userId,
        postsId: postId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Comment added",
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const deleteComment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.user!.id;
  const postId = req.params.id;

  try {
    const comment = await prisma.comments.findFirst({
      where: { postsId: postId, usersId: userId },
    });

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    if (comment.usersId !== userId) {
      res.status(403).json({
        success: false,
        message: "You cannot delete this comment",
      });
      return;
    }

    await prisma.comments.delete({
      where: { id: comment.id },
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted",
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
