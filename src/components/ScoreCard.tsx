import { useEffect, useState } from "react";
import type { ScoreResult } from "@/lib/types";

function getScoreClass(score: number) {
  if (score <= 35) return "score-card--critical";
  if (score <= 55) return "score-card--low";
  if (score <= 70) return "score-card--moderate";
  return "score-card--good";
}

function getScoreMessage(score: number) {
  if (score <= 35) return "Your resume needs urgent visibility fixes before more applications.";
  if (score <= 55) return "Your resume has a base, but it is not converting strongly enough yet.";
  if (score <= 70) return "Your resume has potential, but needs sharper positioning.";
  if (score <= 85) return "Your resume is not weak, but optimization can improve reply quality.";
  return "Your resume visibility looks strong. Now optimize for better roles.";
}

function getScoreTitle(score: number) {
  if (score <= 35) return "Needs Attention!";
  if (score <= 55) return "Low Visibility";
  if (score <= 70) return "Good Start";
  if (score <= 85) return "Good Job";
  return "Strong Score";
}

export function ScoreCard({ scoreResult }: { scoreResult: ScoreResult }) {
  const score = scoreResult.resume_visibility_score;
  const [animatedScore, setAnimatedScore] = useState(0);
  const gaugeLength = 283;
  const gaugeOffset = gaugeLength - (animatedScore / 100) * gaugeLength;
  const needleAngle = -58 + (animatedScore / 100) * 116;
  const ticks = [
    { label: "0-35", color: "#e5484d", active: score <= 35 },
    { label: "36-55", color: "#f59e0b", active: score > 35 && score <= 55 },
    { label: "56-70", color: "#fbc02d", active: score > 55 && score <= 70 },
    { label: "71-85", color: "#84cc16", active: score > 70 && score <= 85 },
    { label: "86-100", color: "#16a34a", active: score > 85 }
  ];

  useEffect(() => {
    let frameId = 0;
    const duration = 1100;
    const startedAt = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [score]);

  return (
    <section className={`score-card ${getScoreClass(score)}`} aria-label="Resume Visibility Score">
      <span className="score-card__badge">
        <span aria-hidden="true">●</span>
        {scoreResult.score_label}
      </span>

      <div className="score-card__meter-row">
        <div className="score-card__number-wrap">
          <p>Resume Visibility Score</p>
          <div className="score-card__number">
            <strong>{animatedScore}</strong>
            <small>/100</small>
          </div>
        </div>

        <svg className="score-gauge" width="220" height="130" viewBox="0 0 220 130" aria-hidden="true">
          <path d="M20 120 A90 90 0 0 1 200 120" stroke="#f1f4f8" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path
            d="M20 120 A90 90 0 0 1 200 120"
            stroke="url(#score-gauge-gradient)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={gaugeLength}
            strokeDashoffset={gaugeOffset}
          />
          <defs>
            <linearGradient id="score-gauge-gradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e5484d" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: "110px 120px" }}>
            <line x1="110" y1="120" x2="110" y2="44" stroke="var(--text)" strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle cx="110" cy="120" r="7" fill="var(--text)" />
        </svg>
      </div>

      <div className="score-card__scale" aria-hidden="true">
        {ticks.map((tick) => (
          <span key={tick.label} className={tick.active ? "is-active" : ""} style={{ "--tick-color": tick.color } as React.CSSProperties}>
            <i />
            {tick.label}
          </span>
        ))}
      </div>

      <div className="score-card__copy">
        <p>{getScoreTitle(score)}</p>
        <span>{getScoreMessage(score)}</span>
      </div>
    </section>
  );
}
