import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import router from "./routers/router";
import cors from "cors";
import morgan from "morgan";
import { checkIp } from "./utils/whitelist";

const app: Express = express();

// Middleware
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Middleware to check IP address
app.use(checkIp);

//App Routes
app.use("/api", router);

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE ");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING on PORT " + process.env.PORT);
});
