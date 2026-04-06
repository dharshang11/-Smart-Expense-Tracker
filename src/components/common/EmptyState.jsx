import { Inbox } from 'lucide-react';
import './EmptyState.css';

export default function EmptyState({ icon: Icon = Inbox, title, message }) {
  return (
    <div className="empty-state animate-fade-in-up">
      <div className="empty-state__icon">
        <Icon size={48} strokeWidth={1.2} />
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
