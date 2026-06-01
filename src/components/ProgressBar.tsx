export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-wrap" aria-label="Survey progress">
      <div className="progress-track">
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
