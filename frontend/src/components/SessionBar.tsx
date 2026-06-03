type SessionBarProps = {
  disabled?: boolean;
  email: string;
  onLogout: () => void;
};

export default function SessionBar({ disabled = false, email, onLogout }: SessionBarProps) {
  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-surface-700/50 pb-6 sm:flex-row">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
          {email.charAt(0).toUpperCase()}
        </div>
        <p className="text-sm font-medium text-text-secondary">
          Candidate: <span className="text-text-primary">{email}</span>
        </p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={onLogout}
        className="rounded-lg border border-surface-600 bg-surface-800 px-4 py-2 text-xs font-bold text-text-secondary transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        Sign Out
      </button>
    </div>
  );
}
