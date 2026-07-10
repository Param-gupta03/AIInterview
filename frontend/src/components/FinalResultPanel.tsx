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
    <div className="space-y-6 text-left animate-fade-in select-none">
      <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-50 p-8 text-center shadow-sm">
        {/* Subtle background accent */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-zinc-950 pointer-events-none" />
        
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-2">Technical Proficiency Score</p>
        <div className="relative inline-block">
          <span className="text-6xl font-black text-zinc-950">{result.score}</span>
          <span className="text-xl font-bold text-zinc-400 ml-1">/ 100</span>
        </div>
        <p className="mt-4 text-xs font-medium text-zinc-500">
          Assessed by <span className="text-zinc-950 font-bold">{result.evaluator} AI Engine</span>
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Expert Feedback</h3>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 leading-relaxed text-zinc-800 text-sm md:text-base shadow-sm">
          {result.feedback}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-zinc-50 p-5 text-sm border border-zinc-200">
        <div className="flex flex-col">
          <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-1">Questions Answered</span>
          <span className="font-extrabold text-emerald-600 text-lg">{answeredCount} / 10</span>
        </div>
        <div className="h-10 w-px bg-zinc-200" />
        <div className="flex flex-col items-end">
          <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider mb-1">Questions Skipped</span>
          <span className="font-extrabold text-red-600 text-lg">{skipped} / 10</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={onExit} 
        className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-white text-zinc-900 font-bold border border-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Complete & Exit Session
      </button>
    </div>
  );
}
