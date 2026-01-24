import { express, Request, Response } from "express";
import { cors } from "cors";
import dotenv from "dotenv";
import app from "./app";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Server is up",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
