import express, { Express, Request, Response } from "express";
import { PORT } from "./secrets";
import router from "./routers/router";
// import cors from 'cors'
// import connectDb from './config/db'

const app: Express = express();

// app.use();s
app.use(express.json());
app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.json("Welcome to TIREDDEV 30 DAYS OF CODE CHALLENGE");
});

app.listen(PORT, () => {
  // connectDb()
  console.log("SERVER RUNNING on PORT " + process.env.PORT);
});

//connect to db
//signup function
//hash passwords
//create jwts
