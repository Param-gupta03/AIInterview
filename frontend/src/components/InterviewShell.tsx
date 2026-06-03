import { useState } from "react";
import FinalResultPanel from "./FinalResultPanel";
import Header from "./Header";
import QuestionPanel from "./QuestionPanel";
import SessionBar from "./SessionBar";
import SetupPanel from "./SetupPanel";
import FaceDetection from "./FaceDetection";
import type { EvaluationResult, InterviewAnswer, InterviewSettings } from "../types/interview";

type InterviewShellProps = {
  answers: InterviewAnswer[];
  currentQuestion: string;
  email: string;
  index: number;
  isProcessing: boolean;
  isRecording: boolean;
  onExitInterview: () => void;
  onLogout: () => void;
  onPrev: () => void;
  onSettingsChange: (settings: InterviewSettings) => void;
  onSkip: () => void;
  onStart: () => void;
  onToggleRecording: () => void;
  questions: string[];
  result: EvaluationResult | null;
  settings: InterviewSettings;
  status: string;
};

export default function InterviewShell(props: InterviewShellProps) {
  const isActive = props.questions.length > 0 && !props.result;
  const [warning, setWarning] = useState<string | null>(null);

  const handleFaceWarning = (message: string) => {
    setWarning(message);
    // Auto-clear warning after 5 seconds
    setTimeout(() => setWarning(null), 5000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-900 p-4 font-sans text-text-primary">
      <div className="card w-full max-w-2xl p-8 text-center animate-fade-in relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        
        <SessionBar disabled={isActive} email={props.email} onLogout={props.onLogout} />
        
        <div className="mt-4">
          <Header status={props.status} />
        </div>

        {!isActive && !props.result && (
          <SetupPanel
            disabled={props.isProcessing}
            settings={props.settings}
            onSettingsChange={props.onSettingsChange}
            onStart={props.onStart}
          />
        )}
        
        {isActive && (
          <div className="flex flex-col">
            <FaceDetection isActive={isActive} onWarning={handleFaceWarning} />
            <QuestionPanel
              current={props.index + 1}
              disabled={props.isProcessing}
              isRecording={props.isRecording}
              onSkip={props.onSkip}
              onPrev={props.onPrev}
              onToggleRecording={props.onToggleRecording}
              question={props.currentQuestion}
              total={10}
            />
          </div>
        )}
        
        {props.result && (
          <FinalResultPanel 
            answers={props.answers} 
            onExit={props.onExitInterview} 
            result={props.result} 
          />
        )}

        {/* Floating Warning Notification */}
        {warning && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-bounce">
            <div className="bg-red-500 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-2 border-2 border-white/20">
              <span className="text-xl">⚠️</span>
              {warning}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
