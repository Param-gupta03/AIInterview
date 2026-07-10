import type { AuthMode } from "../types/auth";

type AuthModeTabsProps = {
  authMode: AuthMode;
  onChange: (mode: AuthMode) => void;
};

export default function AuthModeTabs({ authMode, onChange }: AuthModeTabsProps) {
  const buttonClass = (mode: AuthMode) =>
    `rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all w-full text-center ${
      authMode === mode 
        ? "bg-zinc-950 text-white shadow-sm" 
        : "text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100"
    }`;

  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl bg-zinc-50 p-1.5 border border-zinc-200">
      <button type="button" onClick={() => onChange("login")} className={buttonClass("login")}>
        Login
      </button>
      <button type="button" onClick={() => onChange("signup")} className={buttonClass("signup")}>
        Sign up
      </button>
    </div>
  );
}
