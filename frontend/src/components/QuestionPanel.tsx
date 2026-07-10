import MicControls from "./MicControls";

type QuestionPanelProps = {
  current: number;
  disabled: boolean;
  isRecording: boolean;
  onSkip: () => void;
  onPrev: () => void;
  onToggleRecording: () => void;
  question: string;
  total: number;
};

export default function QuestionPanel({
  current,
  disabled,
  isRecording,
  onSkip,
  onPrev,
  onToggleRecording,
  question,
  total,
}: QuestionPanelProps) {
  return (
    <div className="space-y-6 animate-fade-in select-none">
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-zinc-950 uppercase tracking-widest">Technical Assessment</span>
        <span className="rounded-full bg-zinc-100 px-3.5 py-1 text-xs font-bold text-zinc-500">
          Step {current} / {total}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 h-1.5 w-full bg-zinc-950" />
        <h2 className="text-xl font-semibold leading-relaxed text-zinc-900">
          {question}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button 
          type="button" 
          disabled={disabled || isRecording || current === 1} 
          onClick={onPrev} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-8 rounded-2xl bg-white text-zinc-900 font-bold border border-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Previous
        </button>

        <div className="w-full sm:w-auto">
          <MicControls isRecording={isRecording} isProcessing={disabled} onToggleRecording={onToggleRecording} />
        </div>

        <button 
          type="button" 
          disabled={disabled || isRecording} 
          onClick={onSkip} 
          className="flex items-center justify-center gap-2 w-full sm:w-auto py-4 px-8 rounded-2xl bg-white text-zinc-900 font-bold border border-zinc-200 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Skip / Next
        </button>
      </div>
      
      {isRecording && (
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <div className="h-2 w-2 rounded-full bg-red-600" />
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Recording active...</span>
        </div>
      )}
    </div>
  );
}
