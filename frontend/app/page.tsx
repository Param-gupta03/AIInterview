"use client";

import { useState } from "react";
import AuthForm from "../src/components/AuthForm";
import InterviewShell from "../src/components/InterviewShell";
import LoadingScreen from "../src/components/LoadingScreen";
import { useAuthSession } from "../src/hooks/useAuthSession";
import { useInterviewRecorder } from "../src/hooks/useInterviewRecorder";
import type { InterviewSettings } from "../src/types/interview";

export default function InterviewPage() {
  const { session, saveSession, clearSession, isCheckingSession } = useAuthSession();
  const [settings, setSettings] = useState<InterviewSettings>({
    domain: "DSA",
    difficulty: "BEGINNER",
  });
  const interview = useInterviewRecorder(session?.access_token, settings, clearSession);

  const handleLogout = () => {
    interview.resetInterview();
    clearSession();
  };

  if (isCheckingSession) return <LoadingScreen />;
  if (!session) return <AuthForm onAuthenticated={saveSession} />;

  return (
    <InterviewShell
      answers={interview.answers}
      currentQuestion={interview.currentQuestion}
      email={session.user.email}
      index={interview.index}
      isProcessing={interview.isProcessing}
      isRecording={interview.isRecording}
      onExitInterview={interview.resetInterview}
      onLogout={handleLogout}
      onSettingsChange={setSettings}
      onSkip={interview.skipQuestion}
      onPrev={interview.prevQuestion}
      onStart={interview.startInterview}
      onToggleRecording={interview.toggleRecording}
      questions={interview.questions}
      result={interview.result}
      settings={settings}
      status={interview.status}
    />
  );
}
