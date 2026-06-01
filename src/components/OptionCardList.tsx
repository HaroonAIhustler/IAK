import { useState } from "react";
import { CheckCircle2, ChevronDown } from "lucide-react";

type OptionCardListProps = {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
};

export function OptionCardList({ value, options, onSelect }: OptionCardListProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="option-dropdown">
      <button
        aria-expanded={isOpen}
        className={value ? "dropdown-trigger dropdown-trigger--selected" : "dropdown-trigger"}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{value || "Select the best answer"}</span>
        <ChevronDown size={20} />
      </button>

      {isOpen ? (
        <div className="option-list" role="radiogroup">
          {options.map((option) => (
            <button
              aria-checked={value === option}
              className={value === option ? "option-card option-card--selected" : "option-card"}
              key={option}
              role="radio"
              type="button"
              onClick={() => {
                setIsOpen(false);
                onSelect(option);
              }}
            >
              <span>{option}</span>
              {value === option ? <CheckCircle2 size={19} /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
