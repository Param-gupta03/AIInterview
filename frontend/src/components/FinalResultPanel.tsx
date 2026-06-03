import type { EvaluationResult, InterviewAnswer } from "../types/interview";

type FinalResultPanelProps = {
  answers: InterviewAnswer[];
  onExit: () => void;
  result: EvaluationResult;
};

export default function FinalResultPanel({ answers, onExit, result }: FinalResultPanelProps) {
  const skipped = answers.filter((answer) => answer.skipped).length;
  const answeredCount = answers.length - skipped;

  return (
    <div className="space-y-6 text-left animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center shadow-lg">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
        
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-2">Technical Proficiency Score</p>
        <div className="relative inline-block">
          <span className="text-6xl font-black text-text-primary">{result.score}</span>
          <span className="text-xl font-bold text-text-secondary ml-1">/ 100</span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-secondary">
          Assessed by <span className="text-primary">{result.evaluator} AI Engine</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider">Expert Feedback</h3>
        <div className="rounded-xl border border-surface-700 bg-surface-900 p-6 leading-relaxed text-text-primary shadow-inner">
          {result.feedback}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-surface-700/30 p-4 text-sm">
        <div className="flex flex-col">
          <span className="text-text-secondary">Questions Answered</span>
          <span className="font-bold text-accent">{answeredCount} / 10</span>
        </div>
        <div className="h-8 w-px bg-surface-600" />
        <div className="flex flex-col items-end">
          <span className="text-text-secondary">Questions Skipped</span>
          <span className="font-bold text-red-400">{skipped} / 10</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={onExit} 
        className="btn-primary w-full shadow-lg shadow-primary/20"
      >
        Complete & Exit Session
      </button>
    </div>
  );
}
