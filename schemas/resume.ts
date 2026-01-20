import { z } from "zod";

export const resumeFormSchema = z.object({
  resume: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Only PDF or DOCX files are allowed"
    ),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters"),
});

export type ResumeFormSchema = z.infer<typeof resumeFormSchema>;
