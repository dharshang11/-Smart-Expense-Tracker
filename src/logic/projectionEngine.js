import { calcTotalSpending, calcDaysSinceFirst } from './metricsEngine';

export function calcYearlyProjection(expenses) {
  if (expenses.length === 0) return 0;
  const totalSpending = calcTotalSpending(expenses);
  const daysPassed = calcDaysSinceFirst(expenses);
  return (totalSpending / daysPassed) * 365;
}

export function calcMonthlyProjection(expenses) {
  return calcYearlyProjection(expenses) / 12;
}

export function calcDailyAverage(expenses) {
  if (expenses.length === 0) return 0;
  const totalSpending = calcTotalSpending(expenses);
  const daysPassed = calcDaysSinceFirst(expenses);
  return totalSpending / daysPassed;
}
