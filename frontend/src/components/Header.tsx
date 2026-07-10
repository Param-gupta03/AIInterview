export default function Header({ status }: { status: string }) {
  const isError = status.toLowerCase().includes("failed") || 
                  status.toLowerCase().includes("error") || 
                  status.toLowerCase().includes("denied");
  const statusColorClass = isError ? "text-red-600 font-bold" : "text-emerald-600 font-bold";

  return (
    <header className="mb-8 text-center select-none">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-950">
        AI <span className="italic font-light text-zinc-700">Interviewer</span>
      </h1>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-zinc-200" />
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
          Session Status: <span className={statusColorClass}>{status}</span>
        </p>
        <span className="h-px w-8 bg-zinc-200" />
      </div>
    </header>
  );
}