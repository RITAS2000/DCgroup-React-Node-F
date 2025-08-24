import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import css from './ReUseModal.module.css';
import { GrClose } from 'react-icons/gr';

export default function ReUseModal({ children }) {
  const dispatch = useDispatch();

  const handleClose = () => dispatch(closeModal());

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  const handleBackdropClick = () => handleClose();
  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className={css.backdrop} onClick={handleBackdropClick}>
      <div className={css.modal} onClick={handleModalClick}>
        <button onClick={handleClose} className={css.closeBtn}>
          <GrClose />
        </button>
        {children}
      </div>
    </div>
  );
}
