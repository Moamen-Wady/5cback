import mongoose, { MongooseError } from "mongoose";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import compression from "compression";
dotenv.config();

import ResvRouter from "./routes/resvRoute";
import AdminRouter from "./routes/adminRoute";
const app: Application = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://5c-tau.vercel.app", "https://5c-ag0.pages.dev"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use("/reservations", ResvRouter);
app.use("/admin", AdminRouter);

mongoose
  .connect(
    `mongodb+srv://${process.env.MDBUSER}:${process.env.MDBPWD}@cluster0.iumas.mongodb.net/${process.env.MDBDB}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: MongooseError | unknown) => {
    if (err instanceof MongooseError) {
      console.error("MongoDB connection error:", err.message);
    } else {
      console.error("Unknown error");
    }
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
