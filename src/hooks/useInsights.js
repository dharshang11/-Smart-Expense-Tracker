import { useMemo } from 'react';
import { useExpenses } from './useExpenses';
import { useCurrency } from './useCurrency';
import { useLiveQuery } from 'dexie-react-hooks';
import db from '../data/db';
import { generateInsights } from '../logic/insightsEngine';

export function useInsights() {
  const expenses = useExpenses();
  const currency = useCurrency();
  const budgetRecord = useLiveQuery(() => db.settings.get('monthlyBudget'), []);

  const insights = useMemo(() => {
    const monthlyBudget = budgetRecord ? parseFloat(budgetRecord.value) : 0;
    return generateInsights(expenses, monthlyBudget, currency.symbol);
  }, [expenses, budgetRecord, currency.symbol]);

  return insights;
}
