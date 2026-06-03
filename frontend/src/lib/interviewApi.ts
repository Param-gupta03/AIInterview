import { API_BASE_URL } from "./api";
import type { EvaluationResult, InterviewAnswer, InterviewSettings } from "../types/interview";

const auth = (token?: string) => ({ Authorization: `Bearer ${token}` });

export async function fetchInterviewQuestions(settings: InterviewSettings, token?: string) {
  const formData = new FormData();
  formData.append("domain", settings.domain);
  formData.append("difficulty", settings.difficulty);
  const response = await fetch(`${API_BASE_URL}/interview/questions`, {
    method: "POST",
    headers: auth(token),
    body: formData,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail ?? "Could not load questions.");
  return payload.questions as string[];
}

export async function transcribeInterviewAudio(buffer: BlobPart[], blob: Blob, token?: string) {
  const formData = new FormData();
  formData.append("file", new File(buffer, "answer.mp3", { type: blob.type }));
  const response = await fetch(`${API_BASE_URL}/interview/transcribe`, {
    method: "POST",
    headers: auth(token),
    body: formData,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail ?? "Could not transcribe answer.");
  return String(payload.transcript ?? "");
}

export async function evaluateInterview(
  settings: InterviewSettings,
  answers: InterviewAnswer[],
  token?: string,
): Promise<EvaluationResult> {
  const response = await fetch(`${API_BASE_URL}/interview/evaluate`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...auth(token) },
    body: JSON.stringify({ ...settings, answers }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.detail ?? "Could not evaluate interview.");
  return payload as EvaluationResult;
}
