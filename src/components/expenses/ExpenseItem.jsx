import { getCategoryById, SOURCES } from '../../constants/categories';
import { useCurrency } from '../../hooks/useCurrency';
import { Pencil, Trash2 } from 'lucide-react';
import './ExpenseItem.css';

export default function ExpenseItem({ expense, onEdit, onDelete }) {
  const category = getCategoryById(expense.category);
  const source = SOURCES.find(s => s.id === expense.source);
  const currency = useCurrency();

  return (
    <div className="expense-item" id={`expense-item-${expense.id}`}>
      <div
        className="expense-item__category-dot"
        style={{ background: category.color }}
      />
      <div className="expense-item__details">
        <div className="expense-item__top">
          <span className="expense-item__category-name">{category.label}</span>
          <span className="expense-item__amount">
            {currency.format(expense.amount)}
          </span>
        </div>
        <div className="expense-item__bottom">
          <span className="expense-item__meta">
            {source ? source.label : expense.source}
            {expense.notes ? ` · ${expense.notes}` : ''}
          </span>
        </div>
      </div>
      <div className="expense-item__actions">
        <button
          className="expense-item__action"
          onClick={onEdit}
          aria-label="Edit expense"
        >
          <Pencil size={14} />
        </button>
        <button
          className="expense-item__action expense-item__action--delete"
          onClick={onDelete}
          aria-label="Delete expense"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
