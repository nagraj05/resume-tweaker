"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeFormSchema, type ResumeFormSchema } from "@/schemas/resume";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase/client";
import { parseResume } from "@/app/actions/parse-resume";
import { generateATSResume } from "@/app/actions/generate-resume";
import { ScrollArea } from "./ui/scroll-area";

export function ResumeUploadForm() {
  const form = useForm<ResumeFormSchema>({
    resolver: zodResolver(resumeFormSchema),
  });

  const onSubmit = async (values: ResumeFormSchema) => {
    const file = values.resume;

    toast.loading("Reading resume...");

    // 1️⃣ Parse first
    let resumeText = "";
    try {
      resumeText = await parseResume(file);
    } catch (err) {
      console.error("Parse Error", err);
      toast.dismiss();
      toast.error("Failed to read resume file");
      return;
    }

    if (resumeText.length < 200) {
      toast.dismiss();
      toast.error("Resume text is too short");
      return;
    }

    toast.dismiss();
    toast.loading("Generating ATS resume...");

    // 2️⃣ Generate ATS resume
    let atsResume = "";
    try {
      atsResume = await generateATSResume(resumeText, values.jobDescription);
    } catch {
      toast.dismiss();
      toast.error("Failed to generate ATS resume");
      return;
    }

    toast.dismiss();
    toast.loading("Uploading resume...");

    // 3️⃣ Upload only after success
    const fileExt = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(filePath, file);

    if (uploadError) {
      toast.dismiss();
      toast.error("Failed to upload resume");
      return;
    }

    toast.dismiss();
    toast.success("ATS resume generated successfully");

    console.log(atsResume);

    // 🔜 Next: save to DB
  };

  return (
    <div className="max-w-2xl mx-auto ">
     

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Resume (PDF / DOCX)
            </label>
            <Input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (!file) {
                  form.resetField("resume");
                  return;
                }

                form.setValue("resume", file, { shouldValidate: true });
              }}
            />

            {form.formState.errors.resume && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.resume.message}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description
            </label>
            <ScrollArea className="h-20 rounded-md border">
              <Textarea
                rows={40}
                placeholder="Paste the job description here..."
                className="border-0 focus-visible:ring-0 resize-none"
                {...form.register("jobDescription")}
              />
            </ScrollArea>
            {form.formState.errors.jobDescription && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.jobDescription.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            // className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Processing..." : "Generate Resume"}
          </Button>
        </form>
    </div>
  );
}
