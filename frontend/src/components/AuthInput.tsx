type AuthInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  minLength?: number;
  maxLength?: number;
};

export default function AuthInput({
  label,
  value,
  onChange,
  type = "text",
  minLength,
  maxLength,
}: AuthInputProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-surface-600 bg-surface-800 px-4 py-3 text-sm text-text-primary outline-none ring-primary/20 transition-all focus:border-primary focus:ring-4"
        minLength={minLength}
        maxLength={maxLength}
        required
      />
    </div>
  );
}
