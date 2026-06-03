type ScorePanelProps = {
  feedback: string;
  score: number | null;
  transcript: string;
};

export default function ScorePanel({ feedback, score, transcript }: ScorePanelProps) {
  if (!feedback && score === null && !transcript) return null;

  return (
    <div className="mb-6 rounded-md border border-slate-700 bg-slate-900 p-4 text-left">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Interview score</span>
        <span className="text-lg font-bold text-cyan-300">{score === null ? "--" : `${score}/10`}</span>
      </div>
      {feedback && <p className="mb-3 text-sm text-slate-200">{feedback}</p>}
      {transcript && (
        <p className="border-t border-slate-800 pt-3 text-xs text-slate-400">
          You said: {transcript}
        </p>
      )}
    </div>
  );
}
