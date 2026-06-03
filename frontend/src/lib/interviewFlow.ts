import type { Dispatch, SetStateAction } from "react";
import { evaluateInterview, fetchInterviewQuestions } from "./interviewApi";
import type { EvaluationResult, InterviewAnswer, InterviewSettings } from "../types/interview";

type StateSetters = {
  setAnswers: Dispatch<SetStateAction<InterviewAnswer[]>>;
  setIndex: Dispatch<SetStateAction<number>>;
  setIsProcessing: Dispatch<SetStateAction<boolean>>;
  setQuestions: Dispatch<SetStateAction<string[]>>;
  setResult: Dispatch<SetStateAction<EvaluationResult | null>>;
  setStatus: Dispatch<SetStateAction<string>>;
};

export const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something failed.";

export async function startInterviewAction(
  settings: InterviewSettings,
  token: string | undefined,
  setters: StateSetters,
) {
  setters.setIsProcessing(true);
  setters.setResult(null);
  const loaded = await fetchInterviewQuestions(settings, token);
  setters.setQuestions(loaded);
  setters.setAnswers([]);
  setters.setIndex(0);
  setters.setStatus("Interview started. Answer question 1.");
  setters.setIsProcessing(false);
}

export async function finishInterviewAction(
  settings: InterviewSettings,
  token: string | undefined,
  answers: InterviewAnswer[],
  setters: Pick<StateSetters, "setIsProcessing" | "setResult" | "setStatus">,
) {
  setters.setIsProcessing(true);
  setters.setStatus("Checking all answers...");
  setters.setResult(await evaluateInterview(settings, answers, token));
  setters.setStatus("Interview complete. You can now exit.");
  setters.setIsProcessing(false);
}

export async function saveAnswerAction(
  answer: string,
  skipped: boolean,
  answers: InterviewAnswer[],
  questions: string[],
  index: number,
  setters: Pick<StateSetters, "setAnswers" | "setIndex" | "setStatus">,
  finish: (answers: InterviewAnswer[]) => Promise<void>,
) {
  const currentAnswer = { question: questions[index], answer, skipped };
  let nextAnswers = [...answers];

  if (index < answers.length) {
    // Update existing answer
    nextAnswers[index] = currentAnswer;
  } else {
    // Add new answer
    nextAnswers.push(currentAnswer);
  }

  setters.setAnswers(nextAnswers);
  
  if (nextAnswers.length === 10 && index === 9) {
    await finish(nextAnswers);
  } else {
    setters.setIndex(index + 1);
    setters.setStatus(`Question ${index + 2} of 10.`);
  }
}
