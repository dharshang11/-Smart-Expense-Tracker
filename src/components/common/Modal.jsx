import { useEffect } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export default function Modal({ title, children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    function handleEsc(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">{title}</h2>
          <button
            className="modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}
