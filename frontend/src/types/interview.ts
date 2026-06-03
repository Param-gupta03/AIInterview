export type InterviewDomain =
  | "DSA"
  | "FULL STACK DEVELOPER"
  | "FRONTEND DEVELOPER"
  | "AI ML ENGINEER"
  | "DATA ANALYST";

export type InterviewDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type InterviewSettings = {
  domain: InterviewDomain;
  difficulty: InterviewDifficulty;
};

export type InterviewResult = {
  aiText: string | null;
  audioBlob: Blob;
  feedback: string | null;
  score: number | null;
  transcript: string | null;
};

export type InterviewAnswer = {
  question: string;
  answer: string;
  skipped: boolean;
};

export type EvaluationResult = {
  evaluator: string;
  feedback: string;
  score: number;
};
