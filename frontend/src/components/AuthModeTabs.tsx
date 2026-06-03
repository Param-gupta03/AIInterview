import type { AuthMode } from "../types/auth";

type AuthModeTabsProps = {
  authMode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export default function AuthModeTabs({ authMode, onChange }: AuthModeTabsProps) {
  const buttonClass = (mode: AuthMode) =>
    `rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
      authMode === mode 
        ? "bg-primary text-white shadow-md shadow-primary/20" 
        : "text-text-secondary hover:text-text-primary"
    }`;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-surface-800 p-1.5 border border-surface-700">
      <button type="button" onClick={() => onChange("login")} className={buttonClass("login")}>
        Login
      </button>
      <button type="button" onClick={() => onChange("signup")} className={buttonClass("signup")}>
        Sign up
      </button>
    </div>
  );
}
