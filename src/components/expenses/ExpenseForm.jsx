import { useState, useEffect, useRef } from 'react';
import { addExpense, updateExpense } from '../../data/expenseService';
import { CATEGORIES, SOURCES } from '../../constants/categories';
import Modal from '../common/Modal';
import { format } from 'date-fns';
import './ExpenseForm.css';

export default function ExpenseForm({ expense, onClose }) {
  const isEditing = !!expense;
  const amountRef = useRef(null);

  const [formData, setFormData] = useState({
    amount: '',
    category: 'food',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    source: 'upi',
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: String(expense.amount),
        category: expense.category,
        date: expense.date,
        notes: expense.notes || '',
        source: expense.source || 'cash',
      });
    }
    // Auto-focus amount field
    setTimeout(() => amountRef.current?.focus(), 100);
  }, [expense]);

  function handleChange(field, value) {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!formData.category) {
      setError('Please select a category');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await updateExpense(expense.id, formData);
      } else {
        await addExpense(formData);
      }
      onClose();
    } catch (err) {
      setError('Failed to save expense. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      title={isEditing ? 'Edit Expense' : 'Add Expense'}
      onClose={onClose}
    >
      <form className="expense-form" onSubmit={handleSubmit} id="expense-form">
        {/* Amount Input — large and prominent */}
        <div className="expense-form__amount-section">
          <span className="expense-form__currency">₹</span>
          <input
            ref={amountRef}
            type="number"
            className="expense-form__amount-input"
            placeholder="0"
            value={formData.amount}
            onChange={e => handleChange('amount', e.target.value)}
            min="0"
            step="0.01"
            inputMode="decimal"
            id="expense-amount-input"
          />
        </div>

        {/* Category Grid */}
        <div className="expense-form__field">
          <label>Category</label>
          <div className="category-grid" id="category-grid">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`category-chip ${formData.category === cat.id ? 'category-chip--active' : ''}`}
                style={{
                  '--chip-color': cat.color,
                  borderColor: formData.category === cat.id ? cat.color : 'transparent',
                  background: formData.category === cat.id ? `${cat.color}18` : 'var(--bg-glass)',
                }}
                onClick={() => handleChange('category', cat.id)}
              >
                <span className="category-chip__dot" style={{ background: cat.color }} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div className="expense-form__field">
          <label htmlFor="expense-date">Date</label>
          <input
            type="date"
            id="expense-date"
            value={formData.date}
            onChange={e => handleChange('date', e.target.value)}
            max={format(new Date(), 'yyyy-MM-dd')}
          />
        </div>

        {/* Source */}
        <div className="expense-form__field">
          <label htmlFor="expense-source">Payment Method</label>
          <select
            id="expense-source"
            value={formData.source}
            onChange={e => handleChange('source', e.target.value)}
          >
            {SOURCES.map(src => (
              <option key={src.id} value={src.id}>{src.label}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="expense-form__field">
          <label htmlFor="expense-notes">Notes (optional)</label>
          <input
            type="text"
            id="expense-notes"
            placeholder="What was this for?"
            value={formData.notes}
            onChange={e => handleChange('notes', e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="expense-form__error">{error}</div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={saving}
          id="expense-submit-btn"
        >
          {saving ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
        </button>
      </form>
    </Modal>
  );
}
