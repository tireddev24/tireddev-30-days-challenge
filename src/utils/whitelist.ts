import { NextFunction, Request, Response } from "express";
import { IP1, IP2 } from "../secrets";

export const checkIp = (req: Request, res: Response, next: NextFunction) => {
  const allowedIp = [IP1, IP2];
  const clientIp: string = req.ip!;
  console.log("Client IP:", clientIp);

  if (allowedIp.includes(clientIp)) {
    next();
  } else {
    res.status(403).send("Access denied. Your IP address is not allowed.");
    return;
  }
};
