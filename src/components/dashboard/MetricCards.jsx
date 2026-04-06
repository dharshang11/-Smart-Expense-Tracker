import {
  IndianRupee, TrendingUp, TrendingDown,
  Calendar, CalendarDays, CalendarRange, Minus
} from 'lucide-react';
import { useCurrency } from '../../hooks/useCurrency';
import TiltCard from '../common/TiltCard';
import './MetricCards.css';

function formatAmount(amount) {
  if (amount >= 100000) {
    return `${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export default function MetricCards({ metrics }) {
  const { todayVsYesterday } = metrics;
  const currency = useCurrency();

  const cards = [
    {
      id: 'today',
      label: "Today's Spending",
      amount: metrics.today,
      icon: Calendar,
      gradient: 'var(--gradient-primary)',
      glowColor: 'rgba(56, 189, 248, 0.15)',
    },
    {
      id: 'week',
      label: 'This Week',
      amount: metrics.week,
      icon: CalendarDays,
      gradient: 'var(--gradient-emerald)',
      glowColor: 'rgba(52, 211, 153, 0.15)',
    },
    {
      id: 'month',
      label: 'This Month',
      amount: metrics.month,
      icon: CalendarRange,
      gradient: 'var(--gradient-purple)',
      glowColor: 'rgba(168, 85, 247, 0.15)',
    },
    {
      id: 'yearly',
      label: 'Yearly Estimate',
      amount: metrics.yearlyProjection,
      icon: TrendingUp,
      gradient: 'var(--gradient-coral)',
      glowColor: 'rgba(248, 113, 113, 0.15)',
    },
  ];

  return (
    <div className="metric-cards" id="metric-cards-section">
      {cards.map((card, idx) => (
        <TiltCard
          key={card.id}
          intensity={12}
          className={`metric-card glass-card animate-fade-in-up stagger-${idx + 1}`}
          id={`metric-card-${card.id}`}
        >
          {/* 3D depth layer */}
          <div className="metric-card__3d-bg" style={{ background: `radial-gradient(circle at 80% 20%, ${card.glowColor}, transparent 60%)` }} />

          <div className="metric-card__header">
            <span className="metric-card__label">{card.label}</span>
            <div className="metric-card__icon-wrap" style={{ background: card.gradient }}>
              <card.icon size={16} />
            </div>
          </div>
          <div className="metric-card__amount">
            <span className="metric-card__currency">{currency.symbol}</span>
            <span className="metric-card__value">{formatAmount(card.amount)}</span>
          </div>
          {card.id === 'today' && todayVsYesterday && (
            <div className={`metric-card__trend metric-card__trend--${todayVsYesterday.direction}`}>
              {todayVsYesterday.direction === 'up' && <TrendingUp size={14} />}
              {todayVsYesterday.direction === 'down' && <TrendingDown size={14} />}
              {todayVsYesterday.direction === 'same' && <Minus size={14} />}
              <span>
                {todayVsYesterday.direction === 'same'
                  ? 'Same as yesterday'
                  : `${todayVsYesterday.change.toFixed(0)}% ${todayVsYesterday.direction === 'up' ? 'more' : 'less'} than yesterday`
                }
              </span>
            </div>
          )}
        </TiltCard>
      ))}
    </div>
  );
}
