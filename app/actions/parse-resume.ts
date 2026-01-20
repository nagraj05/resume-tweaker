"use server";

import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

// 🔑 IMPORTANT: disable worker
import { GlobalWorkerOptions } from "pdfjs-dist/legacy/build/pdf.mjs";

GlobalWorkerOptions.workerSrc = ""; // 👈 disable worker

export async function parseResume(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  // ✅ PDF
  if (
    file.type === "application/pdf" ||
    file.name.toLowerCase().endsWith(".pdf")
  ) {
    const parser = new PDFParse({
      data: uint8Array,
    });

    const result = await parser.getText();

    if (!result.text || result.text.length < 50) {
      throw new Error("PDF contains no readable text");
    }

    return result.text;
  }

  // ✅ DOCX
  if (
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({
      buffer: Buffer.from(uint8Array),
    });

    if (!result.value || result.value.length < 50) {
      throw new Error("DOCX contains no readable text");
    }

    return result.value;
  }

  throw new Error("Unsupported file type");
}
