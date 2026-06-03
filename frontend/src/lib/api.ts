export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8010";

export const SESSION_STORAGE_KEY = "interview_auth_session";
