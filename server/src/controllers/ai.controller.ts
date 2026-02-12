import { Request, Response } from "express";
import { generateInterviewQuestion } from "../services/groq.service";
import {
  getOrCreateSession,
  rememberQuestion,
} from "../services/session.service";

export const generateQuestion = async (req: Request, res: Response) => {
  try {
    const { role, language, difficulty, topic, mode = "mixed" } = req.body;

    const userId = req.user!.id;

    const session = await getOrCreateSession({
      userId,
      role,
      language,
      mode,
    });

    const previousQuestions = session.questionsAsked.slice(-8);

    if (!role || !language || !difficulty) {
      return res.status(400).json({
        message: "role, language and difficulty are required",
      });
    }

    const finalTopic = topic || "any relevant concept";

    const question = await generateInterviewQuestion(
      role,
      language,
      difficulty,
      finalTopic,
      mode,
      previousQuestions,
    );

    await rememberQuestion(session.id, question || "");

    res.json({
      question,
      sessionId: session.id,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to generate question",
      error: error.message,
    });
  }
};
