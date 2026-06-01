import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, MapPin, Search } from "lucide-react";
import { searchCities } from "@/data/indianCities";

type SearchableCitySelectProps = {
  selectedCity?: string;
  customCity?: string;
  state?: string;
  onSelect: (city: string, state: string) => void;
  onCustomCityChange: (value: string) => void;
};

export function SearchableCitySelect({
  selectedCity,
  customCity,
  state,
  onSelect,
  onCustomCityChange
}: SearchableCitySelectProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const results = useMemo(() => searchCities(query), [query]);
  const displayValue =
    selectedCity === "Other"
      ? "Other"
      : selectedCity && state
        ? `${selectedCity}, ${state}`
        : "Search and select city";

  return (
    <div className="city-select">
      <button
        aria-expanded={isOpen}
        className={selectedCity ? "dropdown-trigger dropdown-trigger--selected" : "dropdown-trigger"}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{displayValue}</span>
        <ChevronDown size={20} />
      </button>

      {isOpen ? (
        <div className="city-dropdown-panel">
          <label className="search-field">
            <Search size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search city, e.g. Gurgaon"
            />
          </label>

          <div className="city-results">
            {results.map((option) => (
              <button
                className={selectedCity === option.city ? "city-option city-option--selected" : "city-option"}
                key={`${option.city}-${option.state}`}
                type="button"
                onClick={() => {
                  onSelect(option.city, option.state);
                  setQuery(option.city === "Other" ? "" : `${option.city}, ${option.state}`);
                  setIsOpen(false);
                }}
              >
                <span>
                  <MapPin size={17} />
                  {option.city === "Other" ? "Other" : `${option.city}, ${option.state}`}
                </span>
                {selectedCity === option.city ? <CheckCircle2 size={18} /> : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selectedCity && selectedCity !== "Other" && state ? <p className="state-pill">State detected: {state}</p> : null}

      {selectedCity === "Other" ? (
        <label className="text-field">
          <span>Enter your city</span>
          <input value={customCity ?? ""} onChange={(event) => onCustomCityChange(event.target.value)} placeholder="Type your city" />
        </label>
      ) : null}
    </div>
  );
}
