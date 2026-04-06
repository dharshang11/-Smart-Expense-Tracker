import { useState } from 'react';
import BottomNav from './BottomNav';
import Dashboard from '../dashboard/Dashboard';
import ExpenseList from '../expenses/ExpenseList';
import BudgetSettings from '../budget/BudgetSettings';
import SettingsPage from '../settings/SettingsPage';
import ExpenseForm from '../expenses/ExpenseForm';
import QuickAddFAB from '../common/QuickAddFAB';
import ParticleBackground from '../common/ParticleBackground';
import './AppShell.css';

const PAGES = {
  dashboard: Dashboard,
  expenses: ExpenseList,
  budget: BudgetSettings,
  settings: SettingsPage,
};

export default function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const PageComponent = PAGES[activePage];

  function handleEditExpense(expense) {
    setEditingExpense(expense);
    setShowExpenseForm(true);
  }

  function handleCloseForm() {
    setShowExpenseForm(false);
    setEditingExpense(null);
  }

  return (
    <div className="app-shell">
      <ParticleBackground />
      <div className="app-shell__bg-gradient" />
      <main className="app-shell__content">
        <PageComponent onEditExpense={handleEditExpense} />
      </main>

      <QuickAddFAB onClick={() => setShowExpenseForm(true)} />
      <BottomNav active={activePage} onChange={setActivePage} />

      {showExpenseForm && (
        <ExpenseForm
          expense={editingExpense}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
