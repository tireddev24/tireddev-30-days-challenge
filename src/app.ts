import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import morgan from "morgan";
import router from "./routers/router";
import { FRONTEND_URL, NODE_ENV } from "./secrets";
import { checkIp } from "./utils/whitelist";

const createApp = () => {
    const app: Express = express();

    // Middleware
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use(
        cors({
            origin: NODE_ENV === "production" ? FRONTEND_URL : "*",
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
            allowedHeaders: ["Content-Type", "Authorization"],
        })
    );

    if (NODE_ENV === "development") {
        app.use(morgan("dev"));
    }

    // Middleware to check IP address
    if (NODE_ENV === "development") {
        app.use(checkIp);
    }

    //App Routes
    app.use("/api", router);

    app.get("/health", (req, res) => {
        res.status(200).json({ status: "ok", uptime: process.uptime() });
    });

    return app;
};

export default createApp;
