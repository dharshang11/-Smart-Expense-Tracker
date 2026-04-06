import { getDaysInMonth, getDate } from 'date-fns';

export function calcBudgetStatus(monthlyBudget, monthSpending) {
  if (monthlyBudget <= 0) {
    return {
      budget: 0,
      spent: monthSpending,
      remaining: 0,
      percentUsed: 0,
      warningLevel: 'none',
      isSet: false,
    };
  }

  const remaining = Math.max(0, monthlyBudget - monthSpending);
  const percentUsed = (monthSpending / monthlyBudget) * 100;

  let warningLevel = 'none';
  if (percentUsed >= 100) {
    warningLevel = 'danger';
  } else if (percentUsed >= 75) {
    warningLevel = 'caution';
  } else if (percentUsed >= 50) {
    warningLevel = 'warning';
  }

  return {
    budget: monthlyBudget,
    spent: monthSpending,
    remaining,
    percentUsed: Math.min(percentUsed, 100),
    overBudget: monthSpending > monthlyBudget,
    overAmount: Math.max(0, monthSpending - monthlyBudget),
    warningLevel,
    isSet: true,
  };
}

export function calcDailyBudget(remaining, daysLeftInMonth) {
  const now = new Date();
  const totalDays = getDaysInMonth(now);
  const currentDay = getDate(now);
  const daysLeft = daysLeftInMonth || (totalDays - currentDay + 1);
  if (daysLeft <= 0) return 0;
  return remaining / daysLeft;
}

export function getDaysLeftInMonth() {
  const now = new Date();
  const totalDays = getDaysInMonth(now);
  const currentDay = getDate(now);
  return totalDays - currentDay;
}
