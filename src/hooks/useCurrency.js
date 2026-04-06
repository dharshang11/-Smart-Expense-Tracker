import { useLiveQuery } from 'dexie-react-hooks';
import db from '../data/db';
import { getCurrencyByCode } from '../constants/currencies';

export function useCurrency() {
  const record = useLiveQuery(() => db.settings.get('currency'), []);
  const code = record ? record.value : 'INR';
  const currency = getCurrencyByCode(code);

  function format(amount) {
    return `${currency.symbol}${amount.toLocaleString(currency.locale, { maximumFractionDigits: 0 })}`;
  }

  function formatFull(amount) {
    return `${currency.symbol}${amount.toLocaleString(currency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  return { ...currency, format, formatFull };
}
