interface MicControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onToggleRecording: () => void;
}

export default function MicControls({ isRecording, isProcessing, onToggleRecording }: MicControlsProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full sm:w-auto">
      <button
        onClick={onToggleRecording}
        disabled={isProcessing}
        className={`w-full py-4 px-10 rounded-xl font-bold tracking-wide shadow-xl transition-all duration-300 transform active:scale-95 ${
          isProcessing
            ? "bg-surface-600 text-text-secondary cursor-not-allowed"
            : isRecording
            ? "bg-gradient-to-r from-red-600 to-red-500 hover:shadow-red-500/20 text-white"
            : "bg-gradient-to-r from-primary to-primary-hover hover:shadow-primary/30 text-white"
        }`}
      >
        <div className="flex items-center justify-center gap-3">
          {isProcessing ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Analyzing Response...</span>
            </>
          ) : isRecording ? (
            <>
              <div className="h-3 w-3 animate-ping rounded-full bg-white" />
              <span>Submit Answer</span>
            </>
          ) : (
            <>
              <span className="text-xl">🎙️</span>
              <span>Start Speaking</span>
            </>
          )}
        </div>
      </button>
    </div>
  );
}
