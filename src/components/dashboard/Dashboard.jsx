import { useMetrics } from '../../hooks/useMetrics';
import { useBudget } from '../../hooks/useBudget';
import { useInsights } from '../../hooks/useInsights';
import MetricCards from './MetricCards';
import SpendingCharts from './SpendingCharts';
import BudgetGauge from './BudgetGauge';
import InsightsPanel from './InsightsPanel';
import { format } from 'date-fns';
import { Sparkles } from 'lucide-react';
import './Dashboard.css';

export default function Dashboard() {
  const metrics = useMetrics();
  const budget = useBudget();
  const insights = useInsights();

  return (
    <div className="dashboard" id="dashboard-page">
      {/* Header */}
      <header className="dashboard__header animate-fade-in-up">
        <div>
          <p className="dashboard__greeting">
            {getGreeting()}
          </p>
          <h1 className="dashboard__title">
            <Sparkles size={22} className="dashboard__title-icon" />
            <span>Expense Tracker</span>
          </h1>
        </div>
        <div className="dashboard__date">
          {format(new Date(), 'EEE, dd MMM yyyy')}
        </div>
      </header>

      {/* Metric Cards */}
      <MetricCards metrics={metrics} />

      {/* Budget Gauge */}
      {budget.isSet && <BudgetGauge budget={budget} />}

      {/* Smart Insights */}
      <InsightsPanel insights={insights} />

      {/* Charts */}
      <SpendingCharts
        categoryBreakdown={metrics.monthCategoryBreakdown}
        weeklyTrend={metrics.weeklyTrend}
      />
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}
