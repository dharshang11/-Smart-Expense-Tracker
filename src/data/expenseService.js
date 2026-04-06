import db from './db';

export async function addExpense({ amount, category, date, notes, source }) {
  const expense = {
    amount: parseFloat(amount),
    category,
    date: new Date(date).toISOString().split('T')[0],
    notes: notes || '',
    source: source || 'cash',
    createdAt: new Date().toISOString(),
  };
  return await db.expenses.add(expense);
}

export async function updateExpense(id, updates) {
  const sanitized = { ...updates };
  if (sanitized.amount !== undefined) {
    sanitized.amount = parseFloat(sanitized.amount);
  }
  if (sanitized.date !== undefined) {
    sanitized.date = new Date(sanitized.date).toISOString().split('T')[0];
  }
  return await db.expenses.update(id, sanitized);
}

export async function deleteExpense(id) {
  return await db.expenses.delete(id);
}

export async function getExpensesByDateRange(startDate, endDate) {
  const start = new Date(startDate).toISOString().split('T')[0];
  const end = new Date(endDate).toISOString().split('T')[0];
  return await db.expenses
    .where('date')
    .between(start, end, true, true)
    .toArray();
}

export async function getAllExpenses() {
  return await db.expenses.orderBy('date').reverse().toArray();
}
