import dotenv from "dotenv";
dotenv.config();
import { Request, Response } from "express";
import app from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;

app.get("/api/health", (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Server is up",
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
