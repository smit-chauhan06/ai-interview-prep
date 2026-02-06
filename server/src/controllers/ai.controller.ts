import { Request, Response } from "express";
import { generateInterviewQuestion } from "../services/gemini.service";

export const generateQuestion = async (req: Request, res: Response) => {
  try {
    const { role, difficulty } = req.body;

    if (!role || !difficulty) {
      return res.status(400).json({ message: "role and difficulty required" });
    }

    const question = await generateInterviewQuestion(role, difficulty);

    res.json({ question });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to generate question",
      error: error.message,
    });
  }
};
