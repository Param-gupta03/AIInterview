"use client";
import { useState } from "react";
import { cancelAudioRecording, startAudioRecording, stopAudioRecording } from "../lib/audioRecorder";
import { errorMessage, finishInterviewAction, saveAnswerAction, startInterviewAction } from "../lib/interviewFlow";
import type { EvaluationResult, InterviewAnswer, InterviewSettings } from "../types/interview";
export function useInterviewRecorder(token: string | undefined, settings: InterviewSettings, onUnauthorized?: () => void) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [index, setIndex] = useState(0), [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false), [result, setResult] = useState<EvaluationResult | null>(null);
  const [status, setStatus] = useState("Allow microphone, choose domain and level, then start.");
  const fail = (error: unknown) => {
    const message = errorMessage(error);
    if (message.toLowerCase().includes("auth") || message.includes("401")) onUnauthorized?.();
    setStatus(`Connection failed: ${message}`);
  };
  const setters = { setAnswers, setIndex, setIsProcessing, setQuestions, setResult, setStatus };
  const startInterview = async () => {
    try {
      await startInterviewAction(settings, token, setters);
    } catch (error) {
      fail(error);
      setIsProcessing(false);
    }
  };
  const toggleRecording = async () => {
    if (!isRecording) {
      await startAudioRecording();
      setIsRecording(true);
      setStatus("Recording your answer...");
      return;
    }
    setIsRecording(false);
    setIsProcessing(true);
    try {
      await saveAnswer(await stopAudioRecording(token), false);
    } catch (error) {
      fail(error);
    } finally {
      setIsProcessing(false);
    }
  };
  const saveAnswer = async (answer: string, skipped: boolean) => {
    await saveAnswerAction(answer, skipped, answers, questions, index, setters, finishInterview);
  };
  const finishInterview = async (finalAnswers: InterviewAnswer[]) => {
    try {
      await finishInterviewAction(settings, token, finalAnswers, setters);
    } catch (error) {
      fail(error);
      setIsProcessing(false);
    }
  };
  const resetInterview = () => {
    if (isRecording) cancelAudioRecording();
    setQuestions([]); setAnswers([]); setIndex(0); setResult(null);
    setStatus("Allow microphone, choose domain and level, then start.");
  };
  return {
    answers,
    currentQuestion: questions[index] ?? "",
    index,
    isProcessing,
    isRecording,
    questions,
    result,
    resetInterview,
    skipQuestion: () => saveAnswer("", true),
    prevQuestion: () => {
      if (index > 0) {
        setIndex(index - 1);
        setStatus(`Question ${index} of 10.`);
      }
    },
    startInterview,
    status,
    toggleRecording,
  };
}
