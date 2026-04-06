import { LayoutDashboard, List, Wallet, Settings } from 'lucide-react';
import './BottomNav.css';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'expenses', label: 'Expenses', Icon: List },
  { id: 'budget', label: 'Budget', Icon: Wallet },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" id="bottom-navigation">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
        <button
          key={id}
          id={`nav-${id}`}
          className={`bottom-nav__item ${active === id ? 'bottom-nav__item--active' : ''}`}
          onClick={() => onChange(id)}
          aria-label={label}
        >
          <Icon size={22} strokeWidth={active === id ? 2.5 : 1.8} />
          <span className="bottom-nav__label">{label}</span>
          {active === id && <span className="bottom-nav__indicator" />}
        </button>
      ))}
    </nav>
  );
}
