import { ArrowRight, PlayCircle } from "lucide-react";

type VslCTAProps = {
  onClick: () => void;
};

export function VslCTA({ onClick }: VslCTAProps) {
  return (
    <section className="vsl-cta">
      <div>
        <p>Want to start getting replies?</p>
        <span>See how to improve your resume visibility and start applying with a better system.</span>
      </div>
      <button className="primary-button" type="button" onClick={onClick}>
        <PlayCircle size={19} />
        Watch This Video
        <ArrowRight size={18} />
      </button>
    </section>
  );
}
