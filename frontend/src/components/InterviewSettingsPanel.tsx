import { INTERVIEW_DIFFICULTIES, INTERVIEW_DOMAINS } from "../lib/interviewOptions";
import type { InterviewSettings } from "../types/interview";

type InterviewSettingsPanelProps = {
  disabled: boolean;
  settings: InterviewSettings;
  onChange: (settings: InterviewSettings) => void;
};

export default function InterviewSettingsPanel({
  disabled,
  settings,
  onChange,
}: InterviewSettingsPanelProps) {
  return (
    <div className="grid gap-6 text-left sm:grid-cols-2 select-none">
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Expertise Domain
        </label>
        <div className="relative">
          <select
            disabled={disabled}
            value={settings.domain}
            onChange={(event) => onChange({ ...settings, domain: event.target.value as InterviewSettings["domain"] })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:opacity-50 appearance-none cursor-pointer font-medium"
          >
            {INTERVIEW_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
          Experience Level
        </label>
        <div className="relative">
          <select
            disabled={disabled}
            value={settings.difficulty}
            onChange={(event) => onChange({ ...settings, difficulty: event.target.value as InterviewSettings["difficulty"] })}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 disabled:opacity-50 appearance-none cursor-pointer font-medium"
          >
            {INTERVIEW_DIFFICULTIES.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-400 text-[10px]">
            ▼
          </div>
        </div>
      </div>
    </div>
  );
}
