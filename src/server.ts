import { Request, Response } from "express";
import createApp from "./app";
import { PORT } from "./secrets";

const app = createApp();

app.get("/", (req: Request, res: Response): void => {
    res.send("Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE ");
});

app.listen(PORT, () => {
    console.log("SERVER RUNNING on PORT " + process.env.PORT);
});
