interface MicControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onToggleRecording: () => void;
}

export default function MicControls({ isRecording, isProcessing, onToggleRecording }: MicControlsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full sm:w-auto select-none">
      <button
        onClick={onToggleRecording}
        disabled={isProcessing}
        className={`w-full py-4 px-10 rounded-2xl font-extrabold tracking-wide transition-all duration-300 transform active:scale-[0.98] border ${
          isProcessing
            ? "bg-zinc-100 text-zinc-400 border-zinc-200 cursor-not-allowed"
            : isRecording
            ? "bg-red-600 hover:bg-emerald-600 border-red-600 hover:border-emerald-600 text-white shadow-sm"
            : "bg-zinc-950 hover:bg-emerald-600 border-zinc-950 hover:border-emerald-600 text-white shadow-md"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
              <span>Analyzing Response...</span>
            </>
          ) : isRecording ? (
            <>
              <div className="h-2 w-2 animate-ping rounded-full bg-white" />
              <span>Submit Answer</span>
            </>
          ) : (
            <>
              <span className="text-lg">🎙️</span>
              <span>Start Speaking</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
