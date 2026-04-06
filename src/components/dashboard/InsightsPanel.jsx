import * as LucideIcons from 'lucide-react';
import './InsightsPanel.css';

function getInsightStyle(type) {
  switch (type) {
    case 'positive':
      return { bg: 'var(--color-positive-bg)', color: 'var(--color-positive)', border: 'rgba(52, 211, 153, 0.2)' };
    case 'warning':
      return { bg: 'var(--color-warning-bg)', color: 'var(--color-warning)', border: 'rgba(251, 191, 36, 0.2)' };
    case 'danger':
      return { bg: 'var(--color-danger-bg)', color: 'var(--color-danger)', border: 'rgba(248, 113, 113, 0.2)' };
    default:
      return { bg: 'var(--color-info-bg)', color: 'var(--color-info)', border: 'rgba(96, 165, 250, 0.2)' };
  }
}

export default function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="insights-panel animate-fade-in-up stagger-4" id="insights-panel">
      <h3 className="insights-panel__title">
        <LucideIcons.Brain size={18} />
        Smart Insights
      </h3>
      <div className="insights-panel__list">
        {insights.map((insight, idx) => {
          const IconComponent = LucideIcons[insight.icon] || LucideIcons.Lightbulb;
          const style = getInsightStyle(insight.type);
          return (
            <div
              key={idx}
              className="insight-card"
              style={{
                background: style.bg,
                borderColor: style.border,
              }}
            >
              <div className="insight-card__icon" style={{ color: style.color }}>
                <IconComponent size={18} />
              </div>
              <p className="insight-card__message" style={{ color: style.color }}>
                {insight.message}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
