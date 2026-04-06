export const CURRENCIES = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka', locale: 'bn-BD' },
];

export function getCurrencyByCode(code) {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
}

export function formatCurrency(amount, currencyCode = 'INR') {
  const currency = getCurrencyByCode(currencyCode);
  return `${currency.symbol}${amount.toLocaleString(currency.locale, { maximumFractionDigits: 0 })}`;
}

export function formatCurrencyFull(amount, currencyCode = 'INR') {
  const currency = getCurrencyByCode(currencyCode);
  return `${currency.symbol}${amount.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
