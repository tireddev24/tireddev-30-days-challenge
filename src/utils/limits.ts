import { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const loginLimit = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 1000, //1 hour
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message: "Too many login attempts. Please try again later...",
    });
    // return;
  },
});

export const postLimit = rateLimit({
  max: 10,
  windowMs: 60 * 60 * 2000, //2 hours,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      success: false,
      error: "Rate limit exceeded",
      message:
        "You cannot create posts at this time. Please try again later...",
    });
    // return;
  },
});
