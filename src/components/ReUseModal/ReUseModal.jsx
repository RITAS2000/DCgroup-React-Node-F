import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import css from './ReUseModal.module.css';

export default function ReUseModal({ children }) {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(closeModal());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleBackdropClick = () => handleClose();
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={handleModalClick}>
        <button onClick={handleClose} className={css.closeBtn}>
          <svg width="24" height="24">
            <use href="/sprite/symbol-defs.svg#icon-close" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
