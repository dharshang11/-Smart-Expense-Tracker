import { useCurrency } from '../../hooks/useCurrency';
import { AlertTriangle, AlertOctagon, CheckCircle } from 'lucide-react';
import './BudgetGauge.css';

export default function BudgetGauge({ budget }) {
  const { spent, budget: total, remaining, percentUsed, warningLevel, dailyBudget, daysLeft, overBudget, overAmount } = budget;
  const currency = useCurrency();

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (Math.min(percentUsed, 100) / 100) * circumference;

  const gaugeColor =
    warningLevel === 'danger' ? 'var(--color-danger)'
    : warningLevel === 'caution' ? 'var(--color-warning)'
    : 'var(--color-positive)';

  const WarningIcon =
    warningLevel === 'danger' ? AlertOctagon
    : warningLevel === 'caution' ? AlertTriangle
    : CheckCircle;

  return (
    <div className="budget-gauge glass-card-static animate-fade-in-up stagger-3" id="budget-gauge-section">
      <div className="budget-gauge__visual">
        <svg viewBox="0 0 120 120" className="budget-gauge__ring">
          <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
          <circle
            cx="60" cy="60" r="54" fill="none" stroke={gaugeColor}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            transform="rotate(-90 60 60)" className="budget-gauge__progress"
          />
        </svg>
        <div className="budget-gauge__center">
          <span className="budget-gauge__percent" style={{ color: gaugeColor }}>
            {percentUsed.toFixed(0)}%
          </span>
          <span className="budget-gauge__center-label">used</span>
        </div>
      </div>

      <div className="budget-gauge__details">
        <h3 className="budget-gauge__title">Monthly Budget</h3>
        <div className="budget-gauge__stats">
          <div className="budget-gauge__stat">
            <span className="budget-gauge__stat-label">Budget</span>
            <span className="budget-gauge__stat-value">{currency.format(total)}</span>
          </div>
          <div className="budget-gauge__stat">
            <span className="budget-gauge__stat-label">Spent</span>
            <span className="budget-gauge__stat-value">{currency.format(spent)}</span>
          </div>
          <div className="budget-gauge__stat">
            <span className="budget-gauge__stat-label">Remaining</span>
            <span className="budget-gauge__stat-value" style={{ color: overBudget ? 'var(--color-danger)' : 'var(--color-positive)' }}>
              {overBudget ? `-${currency.format(overAmount)}` : currency.format(remaining)}
            </span>
          </div>
          {!overBudget && dailyBudget > 0 && (
            <div className="budget-gauge__stat">
              <span className="budget-gauge__stat-label">Daily limit ({daysLeft}d left)</span>
              <span className="budget-gauge__stat-value">{currency.format(dailyBudget)}/day</span>
            </div>
          )}
        </div>

        {warningLevel !== 'none' && (
          <div className={`budget-gauge__alert budget-gauge__alert--${warningLevel}`}>
            <WarningIcon size={16} />
            <span>
              {warningLevel === 'danger'
                ? 'Budget exceeded! Cut back on spending.'
                : warningLevel === 'caution'
                ? 'Approaching budget limit. Be careful!'
                : 'Spending is high. Monitor closely.'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
