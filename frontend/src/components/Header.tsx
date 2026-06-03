export default function Header({ status }: { status: string }) {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-black tracking-tight text-text-primary">
        AI <span className="text-primary italic">Interviewer</span>
      </h1>
      <div className="mt-4 flex items-center justify-center gap-3">
        <span className="h-px w-8 bg-surface-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-text-secondary">
          Session Status: <span className="text-accent">{status}</span>
        </p>
        <span className="h-px w-8 bg-surface-600" />
      </div>
    </header>
  );
}