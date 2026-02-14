import { Request, Response } from "express";
import { generateInterviewQuestion } from "../services/groq.service";
import {
  getOrCreateSession,
  rememberQuestion,
} from "../services/session.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { evaluateAnswer } from "../services/evaluation.service";
import { InterviewSession } from "../models/InterviewSession.model";

export const generateQuestion = async (req: Request, res: Response) => {
  try {
    const { role, language, difficulty, topic, mode = "mixed" } = req.body;

    const userId = (req as AuthRequest).userId || "";

    const session = await getOrCreateSession({
      userId,
      role,
      language,
      mode,
    });

    const previousQuestions = session.questionsAsked.slice(-8) || [];

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

    await rememberQuestion(session._id.toString(), question || "");

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

export const evaluate = async (req: Request, res: Response) => {
  try {
    const { sessionId, question, answer, role, language, difficulty, mode } =
      req.body;

    if (!question || !answer || !sessionId) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const evaluation = await evaluateAnswer(
      question,
      answer,
      role,
      language,
      difficulty,
      mode,
    );

    await InterviewSession.findByIdAndUpdate(sessionId, {
      $push: {
        evaluations: {
          question,
          answer,
          score: evaluation.score,
          feedback: {
            strengths: evaluation.strengths,
            weaknesses: evaluation.weaknesses,
            missingPoints: evaluation.missingPoints,
          },
          followUp: evaluation.followUpQuestion,
        },
      },
    });

    res.json(evaluation);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to evaluate answer",
      error: error.message,
    });
  }
};
