import { useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../data/db';
import { useMetrics } from './useMetrics';
import { calcBudgetStatus, calcDailyBudget, getDaysLeftInMonth } from '../logic/budgetEngine';

export function useBudget() {
  const budgetRecord = useLiveQuery(() => db.settings.get('monthlyBudget'), []);
  const { month: monthSpending } = useMetrics();

  const budget = useMemo(() => {
    const monthlyBudget = budgetRecord ? parseFloat(budgetRecord.value) : 0;
    const status = calcBudgetStatus(monthlyBudget, monthSpending);
    const daysLeft = getDaysLeftInMonth();
    const dailyBudget = calcDailyBudget(status.remaining, daysLeft);

    return {
      ...status,
      dailyBudget,
      daysLeft,
    };
  }, [budgetRecord, monthSpending]);

  return budget;
}
