import { useLiveQuery } from 'dexie-react-hooks';
import db from '../data/db';

export function useExpenses() {
  const expenses = useLiveQuery(
    () => db.expenses.orderBy('date').reverse().toArray(),
    []
  );
  return expenses || [];
}

export function useExpenseCount() {
  const count = useLiveQuery(() => db.expenses.count(), []);
  return count || 0;
}
