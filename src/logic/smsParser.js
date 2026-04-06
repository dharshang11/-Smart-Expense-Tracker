/**
 * SMS Parser — Pattern matching engine for Indian bank transaction SMS
 * Supports: SBI, HDFC, ICICI, Axis, Kotak, Paytm, GPay, PhonePe, etc.
 */

const AMOUNT_PATTERNS = [
  /(?:Rs\.?|INR|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
  /(?:debited|spent|paid|transferred|withdrawn|charged)\s*(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
  /([\d,]+(?:\.\d{1,2})?)\s*(?:has been|was|is)\s*(?:debited|spent|deducted)/i,
  /amount\s*(?:of\s*)?(?:Rs\.?|INR|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
];

const CATEGORY_KEYWORDS = {
  food: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'pizza', 'burger', 'dining', 'eat', 'kitchen', 'bakery', 'dominos', 'mcdonalds', 'starbucks', 'kfc'],
  transport: ['uber', 'ola', 'rapido', 'metro', 'irctc', 'railway', 'fuel', 'petrol', 'diesel', 'parking', 'toll', 'cab', 'auto', 'bus'],
  shopping: ['amazon', 'flipkart', 'myntra', 'ajio', 'nykaa', 'meesho', 'mall', 'store', 'shop', 'retail', 'purchase'],
  bills: ['electricity', 'jio', 'airtel', 'vi ', 'bsnl', 'broadband', 'wifi', 'internet', 'gas', 'water', 'bill', 'recharge', 'dth', 'insurance', 'premium'],
  entertainment: ['netflix', 'hotstar', 'prime', 'spotify', 'movie', 'cinema', 'pvr', 'inox', 'game', 'play'],
  health: ['hospital', 'clinic', 'pharmacy', 'medical', 'medicine', 'doctor', 'lab', 'diagnostic', 'apollo', 'medplus', 'netmeds', 'practo'],
  education: ['school', 'college', 'university', 'course', 'udemy', 'coursera', 'book', 'tuition', 'exam', 'fee'],
  groceries: ['bigbasket', 'grofers', 'blinkit', 'zepto', 'dmart', 'reliance', 'grocery', 'supermarket', 'vegetables', 'fruits', 'milk'],
  rent: ['rent', 'housing', 'maintenance', 'society', 'apartment', 'flat'],
};

const SOURCE_PATTERNS = {
  upi: /upi|gpay|phonepe|paytm|bhim|google pay/i,
  card: /credit|debit|card|visa|mastercard|rupay/i,
  netbanking: /neft|rtgs|imps|net banking|netbanking/i,
  wallet: /wallet|paytm wallet|amazon pay|freecharge/i,
  cash: /atm|withdraw|cash/i,
};

export function parseSMS(smsText) {
  if (!smsText || typeof smsText !== 'string') return null;

  const text = smsText.toLowerCase();

  // Check if it's a debit/spending SMS (not credit/received)
  const isDebit = /debit|spent|paid|purchase|txn|transaction|debited|charged|withdrawn|payment/i.test(smsText);
  const isCredit = /credit|received|refund|cashback|credited/i.test(smsText);

  if (!isDebit && isCredit) return null; // Skip credit messages
  if (!isDebit && !isCredit) {
    // Check if it has an amount pattern at least
    const hasAmount = AMOUNT_PATTERNS.some(p => p.test(smsText));
    if (!hasAmount) return null;
  }

  // Extract amount
  let amount = null;
  for (const pattern of AMOUNT_PATTERNS) {
    const match = smsText.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      if (amount > 0) break;
    }
  }
  if (!amount || amount <= 0) return null;

  // Detect category
  let category = 'other';
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      category = cat;
      break;
    }
  }

  // Detect source
  let source = 'other';
  for (const [src, pattern] of Object.entries(SOURCE_PATTERNS)) {
    if (pattern.test(smsText)) {
      source = src;
      break;
    }
  }

  // Extract date if present
  let date = new Date().toISOString().split('T')[0];
  const dateMatch = smsText.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/);
  if (dateMatch) {
    const [, d, m, y] = dateMatch;
    const year = y.length === 2 ? '20' + y : y;
    const parsedDate = new Date(`${year}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`);
    if (!isNaN(parsedDate.getTime())) {
      date = parsedDate.toISOString().split('T')[0];
    }
  }

  // Extract merchant/notes
  let notes = '';
  const merchantMatch = smsText.match(/(?:at|to|for|@)\s+([A-Za-z0-9\s]+?)(?:\s+on|\s+ref|\s+txn|\.|\,|\s+a\/c)/i);
  if (merchantMatch) {
    notes = merchantMatch[1].trim().substring(0, 50);
  }

  return {
    amount,
    category,
    source,
    date,
    notes: notes || 'Detected from SMS',
  };
}

export function parseMultipleSMS(smsArray) {
  return smsArray
    .map(sms => {
      const parsed = parseSMS(typeof sms === 'string' ? sms : sms.body || sms.text);
      if (parsed) {
        return { ...parsed, originalText: typeof sms === 'string' ? sms : sms.body || sms.text };
      }
      return null;
    })
    .filter(Boolean);
}

// Test SMS samples for demo
export const SAMPLE_SMS = [
  'Your A/c XX1234 is debited for Rs.250.00 on 07-04-2026. UPI/Swiggy/ref123. Avl Bal: Rs.15000.00',
  'INR 1,500.00 spent on HDFC Credit Card XX5678 at Amazon.in on 07-04-26. Avl limit: 50000',
  'Rs.80 debited from A/c XX9012 to Uber via UPI on 07-04-2026. Txn#456789',
  'Dear Customer, Rs.5000.00 has been debited from your a/c for electricity bill payment via NetBanking',
  'Paid Rs.350 to Zomato via Google Pay. UPI Ref: 789012345. Balance: Rs.12000',
];
