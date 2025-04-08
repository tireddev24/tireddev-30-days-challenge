import { Request, Response } from "express";
import { hashSync } from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const signup = async (req: Request, res: Response) => {
  const { username, firstname, lastname, password, isVerified, email, course } =
    req.body;

  try {
    const user = await prisma.users.create({
      data: {
        username: username || email.slice(0, email.indexOf("@")),
        firstname: firstname,
        lastname: lastname,
        password: hashSync(password, 10),
        isVerified: isVerified,
        email: email,
        course: course,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    console.log(error);
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
