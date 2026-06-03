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
    <div className="grid gap-6 text-left sm:grid-cols-2">
      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Expertise Domain
        </label>
        <select
          disabled={disabled}
          value={settings.domain}
          onChange={(event) => onChange({ ...settings, domain: event.target.value as InterviewSettings["domain"] })}
          className="w-full rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-sm text-text-primary outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 disabled:opacity-50"
        >
          {INTERVIEW_DOMAINS.map((domain) => (
            <option key={domain} value={domain} className="bg-surface-800">
              {domain}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
          Experience Level
        </label>
        <select
          disabled={disabled}
          value={settings.difficulty}
          onChange={(event) => onChange({ ...settings, difficulty: event.target.value as InterviewSettings["difficulty"] })}
          className="w-full rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-sm text-text-primary outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4 disabled:opacity-50"
        >
          {INTERVIEW_DIFFICULTIES.map((level) => (
            <option key={level} value={level} className="bg-surface-800">
              {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
