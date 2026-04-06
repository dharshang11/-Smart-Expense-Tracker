import Dexie from 'dexie';

export const db = new Dexie('SmartExpenseTracker');

db.version(1).stores({
  expenses: '++id, amount, category, date, notes, source, createdAt',
  settings: 'key',
});

export default db;
