import { InterviewSession } from "../models/InterviewSession.model";

export async function getOrCreateSession({
  userId,
  role,
  language,
  mode,
}: {
  userId: string;
  role: string;
  language: string;
  mode: string;
}) {
  let session = await InterviewSession.findOne({
    userId,
    role,
    language,
    mode,
  });

  if (!session) {
    session = await InterviewSession.create({
      userId,
      role,
      language,
      mode,
      questionsAsked: [],
    });
  }

  return session;
}

export async function rememberQuestion(sessionId: string, question: string) {
  await InterviewSession.findByIdAndUpdate(sessionId, {
    $push: { questionsAsked: question },
  });
}
