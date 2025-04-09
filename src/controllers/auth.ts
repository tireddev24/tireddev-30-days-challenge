import { Request, Response } from "express";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const {
    username,
    firstname,
    lastname,
    password: user_password,
    isVerified,
    email,
    course,
  } = req.body;

  try {
    const UserExists = await prisma.users.findFirst({
      where: { email: email },
    });

    if (UserExists) {
      res.status(404).json({ success: false, message: "User already exist" });
    }

    const user = await prisma.users.create({
      data: {
        username: username || email.slice(0, email.indexOf("@")),
        firstname,
        lastname,
        password: hashSync(user_password, 10),
        isVerified,
        email,
        course,
      },
    });

    const { password, ...userData } = user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(201).json({
      success: true,
      message: "User Signed up successfully!",
      userData,
      token,
    });
  } catch (error) {
    console.log(error);
  } finally {
    prisma.$disconnect();
  }
};

export const login = async (req: Request, res: Response) => {
  const { email: user_email, password: user_password } = req.body;

  try {
    const user = await prisma.users.findFirst({
      where: { email: user_email },
    });

    if (!user) {
      res.status(404).json({ success: false, message: "User does not exist" });
      return;
    }

    if (!compareSync(user_password, user.password)) {
      res.status(400).json({ success: false, message: "Password incorrect" });
      return;
    }

    const { password, ...userData } = user;
    const token = jwt.sign({ userId: user.id }, JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Server Error");
  } finally {
    prisma.$disconnect();
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany();
    res.status(302).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    prisma.$disconnect();
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
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  } finally {
    prisma.$disconnect();
  }
};
