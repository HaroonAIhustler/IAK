import { ChevronDown } from "lucide-react";

type SelectInputProps = {
  label: string;
  value: string;
  options: string[];
  placeholder: string;
  onChange: (value: string) => void;
};

export function SelectInput({ label, value, options, placeholder, onChange }: SelectInputProps) {
  return (
    <label className="select-field">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} required>
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown size={20} aria-hidden="true" />
    </label>
  );
}
