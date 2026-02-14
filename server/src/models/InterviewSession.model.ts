import mongoose, { Schema } from "mongoose";

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  language: string;
  mode: "theory" | "practical" | "mixed";
  questionsAsked: string[];
  evaluation: Evaluation[];
  createdAt: Date;
  updatedAt: Date;
}

interface Evaluation {
  question: string;
  answer: string;
  score: string;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    missingPoints: string[];
  };
  followUp?: string;
}

const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    role: String,
    language: String,
    mode: {
      type: String,
      enum: ["theory", "practical", "mixed"],
    },
    questionsAsked: { type: [String], default: [] },
    evaluation: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: {
          strengths: [String],
          weaknesses: [String],
          missingPoints: [String],
        },
        followUp: String,
      },
    ],
  },
  { timestamps: true },
);

export const InterviewSession = mongoose.model<IInterviewSession>(
  "InterviewSession",
  InterviewSessionSchema,
);
