type SessionBarProps = {
  disabled?: boolean;
  email: string;
  onLogout: () => void;
};

export default function SessionBar({ disabled = false, email, onLogout }: SessionBarProps) {
  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row select-none">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 text-xs font-bold text-white shadow-sm">
          {email.charAt(0).toUpperCase()}
        </div>
        <p className="text-sm font-medium text-zinc-500">
          Candidate: <span className="text-zinc-950 font-semibold">{email}</span>
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onLogout}
        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 transition-all duration-300 hover:bg-red-600 hover:text-white hover:border-red-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-30"
      >
        Sign Out
      </button>
    </div>
  );
}
