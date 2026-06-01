"use client";

import { useEffect, useState } from "react";

const loadingLines = [
  "Checking your application-to-reply gap...",
  "Analyzing your resume visibility risk...",
  "Checking ATS awareness...",
  "Factoring in your AI readiness...",
  "Preparing your personalized Resume Visibility Score..."
];

export function LoadingAnalysis() {
  const [completedLines, setCompletedLines] = useState(0);
  const progress = Math.min(100, Math.round((completedLines / loadingLines.length) * 100));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCompletedLines((current) => {
        if (current >= loadingLines.length) {
          window.clearInterval(interval);
          return current;
        }

        return current + 1;
      });
    }, 620);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="loading-analysis" role="status" aria-live="polite">
      <div className="loading-analysis__visual" aria-hidden="true">
        <svg viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="78" stroke="#dcebfa" strokeWidth="6" fill="none" />
          <circle
            cx="90"
            cy="90"
            r="78"
            stroke="url(#loading-gradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray="490"
            strokeDashoffset="490"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            className="loading-ring loading-ring--outer"
          />
          <circle cx="90" cy="90" r="58" stroke="#e5f8ff" strokeWidth="4" fill="none" />
          <circle
            cx="90"
            cy="90"
            r="58"
            stroke="#038cd2"
            strokeWidth="4"
            fill="none"
            strokeDasharray="364"
            strokeDashoffset="364"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            opacity="0.85"
            className="loading-ring loading-ring--inner"
          />
          <defs>
            <linearGradient id="loading-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#19469c" />
              <stop offset="100%" stopColor="#038cd2" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <span>Analyzing</span>
          <strong>{progress}%</strong>
          <span className="loading-dots">
            <i />
            <i />
            <i />
          </span>
        </div>
      </div>
      <h1>Calculating your score</h1>
      <p>Cross-checking your answers against 14 resume-visibility signals.</p>
      <div className="loading-lines">
        {loadingLines.map((line, index) => {
          const state = index < completedLines ? "done" : index === completedLines ? "active" : "pending";

          return (
          <p className={`loading-lines__item loading-lines__item--${state}`} key={line}>
            <span>
              {state === "done" ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : state === "active" ? (
                <span className="loading-dots loading-dots--small">
                  <i />
                  <i />
                  <i />
                </span>
              ) : null}
            </span>
            {line}
          </p>
          );
        })}
      </div>
    </div>
  );
}
