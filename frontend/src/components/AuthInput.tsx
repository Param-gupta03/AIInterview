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
    <div className="space-y-2 select-none">
      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition-all duration-200 focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 font-medium"
        minLength={minLength}
        maxLength={maxLength}
        required
      />
    </div>
  );
}
