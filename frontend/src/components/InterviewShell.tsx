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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-950 select-none">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl p-8 md:p-10 shadow-sm relative overflow-hidden animate-fade-in">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-zinc-950 pointer-events-none" />
        
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
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3.5 rounded-full shadow-lg font-bold flex items-center gap-2 border border-red-700 text-sm animate-bounce">
            <span className="text-base">⚠️</span>
            <span>{warning}</span>
          </div>
        )}
      </div>
    </div>
  );
}
