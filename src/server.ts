import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import router from "./routers/router";
import cors from "cors";
import morgan from "morgan";

const app: Express = express();

// app.use();
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use("/api", router);

//

app.get("/", (req: Request, res: Response): void => {
  console.log("DAYS OF CODE CHALLENGE");
  res.send("Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING on PORT " + process.env.PORT);
});
