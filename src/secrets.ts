import { config } from "dotenv";

config({ path: ".env" });

export const PORT = process.env.PORT!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const IP1 = process.env.IP1!;
export const IP2 = process.env.IP2!;
export const NODE_ENV = process.env.NODE_ENV!;
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const DATABASE_URL = process.env.DATABASE_URL;
