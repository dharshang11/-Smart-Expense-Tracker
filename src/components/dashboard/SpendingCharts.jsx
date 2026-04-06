import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { getCategoryById } from '../../constants/categories';
import { useCurrency } from '../../hooks/useCurrency';
import './SpendingCharts.css';

function CustomTooltip({ active, payload, currencySymbol }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="chart-tooltip glass-card-static">
        <p className="chart-tooltip__label">{data.name || data.payload?.day}</p>
        <p className="chart-tooltip__value">
          {currencySymbol}{Number(data.value).toLocaleString('en-IN')}
        </p>
      </div>
    );
  }
  return null;
}

export default function SpendingCharts({ categoryBreakdown, weeklyTrend }) {
  const currency = useCurrency();
  const hasCategories = categoryBreakdown && categoryBreakdown.length > 0;
  const hasTrend = weeklyTrend && weeklyTrend.some(d => d.amount > 0);

  const pieData = hasCategories
    ? categoryBreakdown.map(item => ({
        name: getCategoryById(item.category).label,
        value: item.amount,
        color: getCategoryById(item.category).color,
      }))
    : [];

  return (
    <div className="charts-section" id="charts-section">
      <div className="chart-container glass-card-static animate-fade-in-up stagger-5">
        <h3 className="chart-title">Spending by Category</h3>
        {hasCategories ? (
          <div className="chart-wrapper">
            <div className="pie-chart-area">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip currencySymbol={currency.symbol} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-legend">
              {pieData.slice(0, 5).map((item, idx) => (
                <div key={idx} className="chart-legend__item">
                  <span className="chart-legend__dot" style={{ background: item.color }} />
                  <span className="chart-legend__label">{item.name}</span>
                  <span className="chart-legend__value">{currency.format(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="chart-empty">Add expenses to see category breakdown</p>
        )}
      </div>

      <div className="chart-container glass-card-static animate-fade-in-up stagger-6">
        <h3 className="chart-title">7-Day Trend</h3>
        {hasTrend ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTrend} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} width={40} />
              <Tooltip content={<CustomTooltip currencySymbol={currency.symbol} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="amount" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={1} />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="chart-empty">Add expenses to see weekly trends</p>
        )}
      </div>
    </div>
  );
}
