import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateInterviewQuestion = async (
  role: string,
  language: string,
  difficulty: string,
  topic: string,
  mode: "theory" | "practical" | "mixed",
  previousQuestions: string[] = [],
) => {
  const seed = Math.floor(Math.random() * 100000);

  const avoidBlock =
    previousQuestions.length > 0
      ? `
Previously asked questions:
${previousQuestions.map((q, i) => `${i + 1}. ${q}`).join("\n")}

Do NOT repeat or closely resemble any of them.
`
      : "";

  const persona =
    mode === "theory"
      ? `
You are an interviewer asking fundamental theory questions.

Ask concise conceptual questions.

Choose topics appropriate for ${language}.
`
      : mode === "practical"
        ? `
You are a senior interviewer.

Ask real-world production or debugging scenarios.

Choose problems appropriate for ${language} and the role ${role}.
`
        : `
You are a senior technical interviewer.

Randomly choose ANY area relevant to:
${language}, ${role}, system design, debugging, performance, data structures,
concurrency, networking, databases, security, testing, deployment.

Ask one realistic interview question.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.9,
    max_tokens: 140,

    messages: [
      {
        role: "system",
        content: persona,
      },
      {
        role: "user",
        content: `
        ${avoidBlock}
Role: ${role}
Primary language/stack: ${language}
Difficulty: ${difficulty}
Topic hint: ${topic}
Session seed: ${seed}

Ask ONE interview question only.
Do not answer it.
`,
      },
    ],
  });

  return completion.choices[0].message.content;
};
