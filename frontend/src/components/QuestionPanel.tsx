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
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-primary uppercase tracking-widest">Technical Assessment</span>
        <span className="rounded-full bg-surface-700 px-3 py-1 text-xs font-semibold text-text-secondary">
          Step {current} / {total}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 p-8 shadow-inner">
        {/* Subtle accent line */}
        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-primary to-accent opacity-50" />
        <h2 className="text-xl font-medium leading-relaxed text-text-primary">
          {question}
        </h2>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button 
          type="button" 
          disabled={disabled || isRecording || current === 1} 
          onClick={onPrev} 
          className="w-full sm:w-auto rounded-xl border border-surface-600 bg-surface-800 px-6 py-4 font-semibold text-text-secondary transition-all hover:bg-surface-700 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed text-sm"
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
          className="w-full sm:w-auto rounded-xl border border-surface-600 bg-surface-800 px-6 py-4 font-semibold text-text-secondary transition-all hover:bg-surface-700 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed text-sm"
        >
          Skip / Next
        </button>
      </div>
      
      {isRecording && (
        <div className="flex items-center justify-center gap-2 animate-pulse">
          <div className="h-2 w-2 rounded-full bg-red-500" />
          <span className="text-xs font-medium text-red-500 uppercase tracking-tighter">Recording active...</span>
        </div>
      )}
    </div>
  );
}
