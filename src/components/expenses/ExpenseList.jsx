import { useState } from 'react';
import { useExpenses } from '../../hooks/useExpenses';
import { useMetrics } from '../../hooks/useMetrics';
import { useCurrency } from '../../hooks/useCurrency';
import { deleteExpense } from '../../data/expenseService';
import ExpenseItem from './ExpenseItem';
import EmptyState from '../common/EmptyState';
import { Receipt, Search, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import './ExpenseList.css';

export default function ExpenseList({ onEditExpense }) {
  const expenses = useExpenses();
  const { total, expenseCount } = useMetrics();
  const currency = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filtered = expenses.filter(e => {
    const matchesSearch = searchQuery === '' ||
      e.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Group expenses by date
  const grouped = filtered.reduce((acc, expense) => {
    const dateKey = expense.date;
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  // Get unique categories from actual expenses
  const activeCategories = [...new Set(expenses.map(e => e.category))];

  async function handleDelete(id) {
    if (window.confirm('Delete this expense?')) {
      await deleteExpense(id);
    }
  }

  return (
    <div className="expense-list-page" id="expenses-page">
      <header className="expense-list-page__header animate-fade-in-up">
        <div>
          <h1 className="expense-list-page__title">Expenses</h1>
          <p className="expense-list-page__subtitle">
            {expenseCount} entries · {currency.format(total)} total
          </p>
        </div>
      </header>

      {/* Search + Filter */}
      <div className="expense-list-page__controls animate-fade-in-up stagger-1">
        <div className="search-input-wrap">
          <Search size={16} className="search-input-wrap__icon" />
          <input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="search-input"
            id="expense-search-input"
          />
        </div>
        {activeCategories.length > 1 && (
          <div className="filter-wrap">
            <Filter size={14} />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="filter-select"
              id="expense-filter-select"
            >
              <option value="all">All</option>
              {activeCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Expense Groups */}
      {sortedDates.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No expenses yet"
          message="Tap the + button to add your first expense and start tracking your spending."
        />
      ) : (
        <div className="expense-groups">
          {sortedDates.map(dateKey => {
            const dayExpenses = grouped[dateKey];
            const dayTotal = dayExpenses.reduce((s, e) => s + e.amount, 0);
            const isToday = dateKey === format(new Date(), 'yyyy-MM-dd');

            return (
              <div key={dateKey} className="expense-group animate-fade-in-up">
                <div className="expense-group__header">
                  <span className="expense-group__date">
                    {isToday ? 'Today' : format(parseISO(dateKey), 'EEE, dd MMM yyyy')}
                  </span>
                  <span className="expense-group__total">
                    {currency.format(dayTotal)}
                  </span>
                </div>
                <div className="expense-group__items">
                  {dayExpenses.map(exp => (
                    <ExpenseItem
                      key={exp.id}
                      expense={exp}
                      onEdit={() => onEditExpense(exp)}
                      onDelete={() => handleDelete(exp.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
