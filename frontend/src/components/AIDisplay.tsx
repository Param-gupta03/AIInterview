export default function AIDisplay({ aiText }: { aiText: string }) {
  return (
    <div className="mb-8 p-6 bg-slate-900 border border-slate-700 rounded-xl min-h-[120px] flex flex-col justify-center items-center text-center shadow-inner">
      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2">
        Interviewer (Gemini)
      </span>
      <p className="text-slate-200 text-lg leading-relaxed">
        {aiText ? aiText : '"Select your domain and level, then answer the first prompt aloud."'}
      </p>
    </div>
  );
}
