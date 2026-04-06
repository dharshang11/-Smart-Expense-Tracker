import { useState, useEffect } from 'react';
import { useBudget } from '../../hooks/useBudget';
import { useMetrics } from '../../hooks/useMetrics';
import { useCurrency } from '../../hooks/useCurrency';
import { setMonthlyBudget } from '../../data/settingsService';
import BudgetGauge from '../dashboard/BudgetGauge';
import { Wallet, Save, TrendingUp, CalendarDays, Calculator } from 'lucide-react';
import { format } from 'date-fns';
import './BudgetSettings.css';

export default function BudgetSettings() {
  const budget = useBudget();
  const metrics = useMetrics();
  const currency = useCurrency();
  const [inputAmount, setInputAmount] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (budget.isSet) {
      setInputAmount(String(budget.budget));
    }
  }, [budget.budget, budget.isSet]);

  async function handleSave() {
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) return;
    await setMonthlyBudget(amount);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="budget-page" id="budget-page">
      <header className="budget-page__header animate-fade-in-up">
        <h1 className="budget-page__title">
          <Wallet size={22} />
          Budget
        </h1>
        <p className="budget-page__subtitle">{format(new Date(), 'MMMM yyyy')}</p>
      </header>

      <div className="budget-input-card glass-card-static animate-fade-in-up stagger-1">
        <h3 className="budget-input-card__title">Set Monthly Budget</h3>
        <div className="budget-input-card__row">
          <div className="budget-input-card__input-wrap">
            <span className="budget-input-card__currency">{currency.symbol}</span>
            <input
              type="number" className="budget-input-card__input"
              placeholder="Enter amount" value={inputAmount}
              onChange={e => setInputAmount(e.target.value)} min="0" inputMode="numeric"
              id="budget-amount-input"
            />
          </div>
          <button
            className={`btn ${saved ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleSave}
            disabled={!inputAmount || parseFloat(inputAmount) <= 0}
            id="budget-save-btn"
          >
            <Save size={16} />
            {saved ? 'Saved!' : 'Save'}
          </button>
        </div>
      </div>

      {budget.isSet && <BudgetGauge budget={budget} />}

      <div className="budget-stats animate-fade-in-up stagger-2">
        <div className="budget-stat-card glass-card">
          <div className="budget-stat-card__icon" style={{ background: 'var(--gradient-primary)' }}>
            <CalendarDays size={18} />
          </div>
          <div className="budget-stat-card__info">
            <span className="budget-stat-card__label">Daily Average</span>
            <span className="budget-stat-card__value">{currency.format(metrics.dailyAverage)}</span>
          </div>
        </div>
        <div className="budget-stat-card glass-card">
          <div className="budget-stat-card__icon" style={{ background: 'var(--gradient-emerald)' }}>
            <TrendingUp size={18} />
          </div>
          <div className="budget-stat-card__info">
            <span className="budget-stat-card__label">Monthly Estimate</span>
            <span className="budget-stat-card__value">{currency.format(metrics.monthlyProjection)}</span>
          </div>
        </div>
        <div className="budget-stat-card glass-card">
          <div className="budget-stat-card__icon" style={{ background: 'var(--gradient-coral)' }}>
            <Calculator size={18} />
          </div>
          <div className="budget-stat-card__info">
            <span className="budget-stat-card__label">Yearly Projection</span>
            <span className="budget-stat-card__value">{currency.format(metrics.yearlyProjection)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
