export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: 'UtensilsCrossed', color: '#f97316' },
  { id: 'transport', label: 'Transport', icon: 'Car', color: '#3b82f6' },
  { id: 'shopping', label: 'Shopping', icon: 'ShoppingBag', color: '#a855f7' },
  { id: 'bills', label: 'Bills & Utilities', icon: 'Receipt', color: '#ef4444' },
  { id: 'entertainment', label: 'Entertainment', icon: 'Gamepad2', color: '#ec4899' },
  { id: 'health', label: 'Health', icon: 'Heart', color: '#10b981' },
  { id: 'education', label: 'Education', icon: 'GraduationCap', color: '#6366f1' },
  { id: 'groceries', label: 'Groceries', icon: 'Apple', color: '#14b8a6' },
  { id: 'rent', label: 'Rent & Housing', icon: 'Home', color: '#f59e0b' },
  { id: 'other', label: 'Other', icon: 'MoreHorizontal', color: '#64748b' },
];

export const SOURCES = [
  { id: 'cash', label: 'Cash' },
  { id: 'upi', label: 'UPI' },
  { id: 'card', label: 'Credit/Debit Card' },
  { id: 'netbanking', label: 'Net Banking' },
  { id: 'wallet', label: 'Wallet' },
  { id: 'other', label: 'Other' },
];

export const CURRENCY_SYMBOL = '₹';

export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1];
}

export function getCategoryColor(id) {
  return getCategoryById(id).color;
}
