import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const evaluateAnswer = async (
  question: string,
  answer: string,
  role: string,
  language: string,
  difficulty: string,
  mode: string,
) => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4, // low = more objective
    max_tokens: 400,

    messages: [
      {
        role: "system",
        content: `
            You are a strict technical interviewer with years of experience.

            Evaluate the candidate objectively.

            Return ONLY valid JSON in this format:

            {
            "score":number (0-10),
            "strengths": [string],
            "weaknesses": [string],
            "missingPoints": [string],
            "followUpQuestion": string
            }

            Do not explain outside JSON.
            `,
      },
      {
        role: "user",
        content: `
        Role:${role},
        Language:${language},
        Mode:${mode}

        Question:${question}

        Candidate Answer:${answer}
        `,
      },
    ],
  });

  const content = completion.choices[0].message.content;

  return JSON.parse(content!);
};
