import { ArrowRight } from "lucide-react";

export function StickyCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="sticky-cta">
      <button type="button" onClick={onClick}>
        Fix My Resume Now
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
