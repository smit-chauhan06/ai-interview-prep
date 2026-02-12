import mongoose, { Schema } from "mongoose";

export interface IInterviewSession extends Document {
  userId: mongoose.Types.ObjectId;
  role: string;
  language: string;
  mode: "theory" | "practical" | "mixed";
  questionsAsked: string[];
  createdAt: Date;
  updatedAt: Date;
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
  },
  { timestamps: true },
);

export const InterviewSession = mongoose.model<IInterviewSession>(
  "InterviewSession",
  InterviewSessionSchema,
);
