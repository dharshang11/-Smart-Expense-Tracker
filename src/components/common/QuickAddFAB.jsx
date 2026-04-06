import { Plus } from 'lucide-react';
import './QuickAddFAB.css';

export default function QuickAddFAB({ onClick }) {
  return (
    <button
      className="fab"
      onClick={onClick}
      aria-label="Add expense"
      id="quick-add-fab"
    >
      <span className="fab__glow" />
      <span className="fab__ring" />
      <span className="fab__icon">
        <Plus size={28} strokeWidth={2.5} />
      </span>
    </button>
  );
}
