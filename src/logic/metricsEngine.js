import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  startOfMonth, endOfMonth, subDays, format,
  isWithinInterval, parseISO, differenceInDays
} from 'date-fns';

function toDate(dateStr) {
  return parseISO(dateStr);
}

function filterByDateRange(expenses, start, end) {
  return expenses.filter(e => {
    const d = toDate(e.date);
    return isWithinInterval(d, { start, end });
  });
}

export function calcTotalSpending(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function calcTodaySpending(expenses) {
  const now = new Date();
  const filtered = filterByDateRange(expenses, startOfDay(now), endOfDay(now));
  return calcTotalSpending(filtered);
}

export function calcYesterdaySpending(expenses) {
  const yesterday = subDays(new Date(), 1);
  const filtered = filterByDateRange(expenses, startOfDay(yesterday), endOfDay(yesterday));
  return calcTotalSpending(filtered);
}

export function calcWeekSpending(expenses) {
  const now = new Date();
  const filtered = filterByDateRange(expenses, startOfWeek(now, { weekStartsOn: 1 }), endOfWeek(now, { weekStartsOn: 1 }));
  return calcTotalSpending(filtered);
}

export function calcMonthSpending(expenses) {
  const now = new Date();
  const filtered = filterByDateRange(expenses, startOfMonth(now), endOfMonth(now));
  return calcTotalSpending(filtered);
}

export function calcCategoryBreakdown(expenses) {
  const map = {};
  expenses.forEach(e => {
    if (!map[e.category]) {
      map[e.category] = 0;
    }
    map[e.category] += e.amount;
  });
  return Object.entries(map)
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function calcWeeklyTrend(expenses) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const day = subDays(new Date(), i);
    const dayStr = format(day, 'yyyy-MM-dd');
    const label = format(day, 'EEE');
    const total = expenses
      .filter(e => e.date === dayStr)
      .reduce((sum, e) => sum + e.amount, 0);
    days.push({ day: label, date: dayStr, amount: total });
  }
  return days;
}

export function calcTodayVsYesterday(expenses) {
  const today = calcTodaySpending(expenses);
  const yesterday = calcYesterdaySpending(expenses);
  if (yesterday === 0) {
    return { today, yesterday, change: today > 0 ? 100 : 0, direction: today > 0 ? 'up' : 'same' };
  }
  const change = ((today - yesterday) / yesterday) * 100;
  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'same';
  return { today, yesterday, change: Math.abs(change), direction };
}

export function calcDaysSinceFirst(expenses) {
  if (expenses.length === 0) return 0;
  const sorted = [...expenses].sort((a, b) => a.date.localeCompare(b.date));
  const firstDate = toDate(sorted[0].date);
  return Math.max(1, differenceInDays(new Date(), firstDate) + 1);
}

export function calcMonthCategoryBreakdown(expenses) {
  const now = new Date();
  const monthExpenses = filterByDateRange(expenses, startOfMonth(now), endOfMonth(now));
  return calcCategoryBreakdown(monthExpenses);
}
