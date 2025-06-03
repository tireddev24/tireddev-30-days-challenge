import { Request, Response, NextFunction } from "express";

import {
  TokenExpiredError,
  JsonWebTokenError,
  JwtPayload,
  verify,
} from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { Users } from "@prisma/client";

declare module "express" {
  export interface Request {
    user?: Pick<Users, "id" | "email">;
  }
}

export const verifyJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies.tk;
  if (!token) {
    res.status(401).json({ message: "No Token Found" });
    return;
  }

  try {
    const user = verify(token, JWT_SECRET as string) as JwtPayload;

    if (!user) {
      res.status(401).json({ message: "Invalid Token" });
      return;
    }
    req.user = {
      id: user.id as string,
      email: user.email as string,
    };

    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ message: "Token expired" });
      return;
    }
    if (error instanceof JsonWebTokenError) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};
