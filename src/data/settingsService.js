import db from './db';

export async function getSetting(key) {
  const record = await db.settings.get(key);
  return record ? record.value : null;
}

export async function setSetting(key, value) {
  return await db.settings.put({ key, value });
}

export async function getMonthlyBudget() {
  const val = await getSetting('monthlyBudget');
  return val ? parseFloat(val) : 0;
}

export async function setMonthlyBudget(amount) {
  return await setSetting('monthlyBudget', parseFloat(amount));
}
