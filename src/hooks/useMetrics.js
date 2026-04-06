import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import {
  calcTotalSpending, calcTodaySpending, calcYesterdaySpending,
  calcWeekSpending, calcMonthSpending, calcCategoryBreakdown,
  calcWeeklyTrend, calcTodayVsYesterday, calcMonthCategoryBreakdown
} from '../logic/metricsEngine';
import { calcYearlyProjection, calcMonthlyProjection, calcDailyAverage } from '../logic/projectionEngine';

export function useMetrics() {
  const expenses = useExpenses();

  const metrics = useMemo(() => {
    return {
      total: calcTotalSpending(expenses),
      today: calcTodaySpending(expenses),
      yesterday: calcYesterdaySpending(expenses),
      week: calcWeekSpending(expenses),
      month: calcMonthSpending(expenses),
      yearlyProjection: calcYearlyProjection(expenses),
      monthlyProjection: calcMonthlyProjection(expenses),
      dailyAverage: calcDailyAverage(expenses),
      categoryBreakdown: calcCategoryBreakdown(expenses),
      monthCategoryBreakdown: calcMonthCategoryBreakdown(expenses),
      weeklyTrend: calcWeeklyTrend(expenses),
      todayVsYesterday: calcTodayVsYesterday(expenses),
      expenseCount: expenses.length,
    };
  }, [expenses]);

  return metrics;
}
