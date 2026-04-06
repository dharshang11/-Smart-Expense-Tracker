import {
  calcTodaySpending, calcYesterdaySpending,
  calcWeekSpending, calcMonthSpending,
  calcCategoryBreakdown, calcTodayVsYesterday
} from './metricsEngine';
import { calcDailyAverage } from './projectionEngine';
import { calcBudgetStatus } from './budgetEngine';
import { getCategoryById } from '../constants/categories';
import { subDays, startOfWeek, endOfWeek, startOfDay, endOfDay, isWithinInterval, parseISO } from 'date-fns';

function filterByDateRange(expenses, start, end) {
  return expenses.filter(e => {
    const d = parseISO(e.date);
    return isWithinInterval(d, { start, end });
  });
}

function calcLastWeekSpending(expenses) {
  const lastWeekStart = startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 });
  const lastWeekEnd = endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 });
  return filterByDateRange(expenses, lastWeekStart, lastWeekEnd)
    .reduce((s, e) => s + e.amount, 0);
}

export function generateInsights(expenses, monthlyBudget, currencySymbol = '₹') {
  const insights = [];
  if (expenses.length === 0) {
    insights.push({
      type: 'info',
      icon: 'Lightbulb',
      message: 'Start tracking your expenses to get personalized insights!',
    });
    return insights;
  }

  // 1. Today vs Yesterday comparison
  const comparison = calcTodayVsYesterday(expenses);
  if (comparison.direction === 'up' && comparison.change > 20) {
    insights.push({
      type: 'warning',
      icon: 'TrendingUp',
      message: `You've spent ${comparison.change.toFixed(0)}% more today than yesterday. Consider slowing down.`,
    });
  } else if (comparison.direction === 'down' && comparison.yesterday > 0) {
    insights.push({
      type: 'positive',
      icon: 'TrendingDown',
      message: `Great job! You've spent ${comparison.change.toFixed(0)}% less today than yesterday.`,
    });
  }

  // 2. Week over week
  const thisWeek = calcWeekSpending(expenses);
  const lastWeek = calcLastWeekSpending(expenses);
  if (lastWeek > 0) {
    const weekChange = ((thisWeek - lastWeek) / lastWeek) * 100;
    if (weekChange > 15) {
      insights.push({
        type: 'warning',
        icon: 'AlertTriangle',
        message: `You're spending ${weekChange.toFixed(0)}% more than last week. Watch your expenses!`,
      });
    } else if (weekChange < -10) {
      insights.push({
        type: 'positive',
        icon: 'Award',
        message: `Your spending is down ${Math.abs(weekChange).toFixed(0)}% from last week. Keep it up!`,
      });
    }
  }

  // 3. Top spending category
  const categories = calcCategoryBreakdown(expenses);
  if (categories.length > 0) {
    const top = categories[0];
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const pct = (top.amount / total) * 100;
    const catInfo = getCategoryById(top.category);
    if (pct > 40) {
      insights.push({
        type: 'warning',
        icon: 'PieChart',
        message: `${catInfo.label} accounts for ${pct.toFixed(0)}% of your total spending. Consider balancing your expenses.`,
      });
    }
  }

  // 4. Budget pace analysis
  if (monthlyBudget > 0) {
    const monthSpending = calcMonthSpending(expenses);
    const budgetStatus = calcBudgetStatus(monthlyBudget, monthSpending);
    if (budgetStatus.warningLevel === 'danger') {
      insights.push({
        type: 'danger',
        icon: 'AlertOctagon',
        message: `Budget exceeded! You've overspent by ${currencySymbol}${budgetStatus.overAmount.toLocaleString()}. Try to cut back.`,
      });
    } else if (budgetStatus.warningLevel === 'caution') {
      insights.push({
        type: 'warning',
        icon: 'AlertTriangle',
        message: `You've used ${budgetStatus.percentUsed.toFixed(0)}% of your monthly budget. Be careful with remaining spending.`,
      });
    } else if (budgetStatus.percentUsed < 50) {
      insights.push({
        type: 'positive',
        icon: 'CheckCircle',
        message: `You're on track! Only ${budgetStatus.percentUsed.toFixed(0)}% of your budget used so far.`,
      });
    }
  }

  // 5. Daily spending anomaly
  const dailyAvg = calcDailyAverage(expenses);
  const todaySpending = calcTodaySpending(expenses);
  if (dailyAvg > 0 && todaySpending > dailyAvg * 2) {
    insights.push({
      type: 'warning',
      icon: 'Zap',
      message: `Today's spending is ${(todaySpending / dailyAvg).toFixed(1)}x your daily average. Unusual activity detected.`,
    });
  }

  // 6. Streak detection — no spending today
  if (todaySpending === 0 && expenses.length > 0) {
    insights.push({
      type: 'positive',
      icon: 'Sparkles',
      message: 'No spending yet today! A great day to save.',
    });
  }

  return insights.slice(0, 5); // max 5 insights
}
