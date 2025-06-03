import { Request, Response } from "express";
import { PORT } from "./secrets";
import { PrismaClient } from "@prisma/client";
import createApp from "./app";

export const prisma = new PrismaClient();

const app = createApp();

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE ");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING on PORT " + process.env.PORT);
});
