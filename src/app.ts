import express, { Express } from "express";
import router from "./routers/router";
import { checkIp } from "./utils/whitelist";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

const createApp = () => {
  const app: Express = express();

  // Middleware
  app.use(morgan("dev"));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  // Middleware to check IP address
  app.use(checkIp);

  //App Routes
  app.use("/api", router);

  return app;
};

export default createApp;
