"use server";

export async function generateATSResume(
  resumeText: string,
  jobDescription: string
) {
  const prompt = `
You are an ATS resume optimization expert.

Rules:
- ATS-friendly
- No tables or graphics
- Do not invent experience
- Use strong action verbs
- Match keywords from job description

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Return ONLY the rewritten resume text.
`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await res.json();

  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ??
    "Failed to generate resume"
  );
}
