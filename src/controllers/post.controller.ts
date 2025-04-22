import { Request, Response } from "express";
import { PrismaClient, PostStatus } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { title, content } = req.body;

  const { id } = req.user!;

  try {
    const post = await prisma.posts.create({
      data: {
        title,
        body: content,
        status: PostStatus.DRAFT,
        usersId: id,
      },
    });
    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const getUsersPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.user!;

  try {
    const post = await prisma.posts.findMany({
      where: { usersId: id },
      include: {
        author: true,
        likes: true,
      },
    });
    if (!post) {
      res
        .status(404)
        .json({ success: false, message: "This user has no posts." });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Post(s) retrieved successfully",
      post: {
        ...post,
        likesCount: post.reduce((total, p) => total + p.likes.length, 0),
      },
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        author: true,
        likes: true,
      },
    });
    if (!posts) {
      res.status(404).json({ success: false, message: "There are no posts." });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      posts: posts.map((post) => ({
        ...post,
        likesCount: post.likes.length,
      })),
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postId = req.params.id;
  const { id } = req.user!;
  const { title, content } = req.body;

  try {
    await prisma.users.findUniqueOrThrow({
      where: { id },
    });

    const post = await prisma.posts.update({
      where: { id: postId },
      data: {
        title,
        body: content,
        status: PostStatus.PUBLISHED,
      },
    });
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};

export const deletePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const postId = req.params.id;
  const { id } = req.user!;

  try {
    await prisma.users.findUniqueOrThrow({
      where: { id },
    });

    const post = await prisma.posts.delete({
      where: { id: postId },
    });
    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      post,
    });
    return;
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
    return;
  }
};
