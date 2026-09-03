import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  autocomplete?: string;
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}

export function PasswordInput({
  id,
  autocomplete,
  label,
  value,
  visible,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>

      <div className="relative">
        <input
          autoComplete={autocomplete}
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-lg border border-slate-300 py-3 pl-4 pr-11 text-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200"
          placeholder="••••••••"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
