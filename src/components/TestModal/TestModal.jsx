import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import { selectIsModalOpen } from '../../redux/modal/selectors.js';
import css from './TestModal.module.css';
import { useEffect } from 'react';

export default function TestModal() {
  const isOpen = useSelector(selectIsModalOpen);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        dispatch(closeModal());
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  if (!isOpen) return null; // якщо модалка закрита — нічого не рендеримо
  return (
    <div className={css.backdrop} onClick={() => dispatch(closeModal())}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Login Required</h2>
        <p>Please log in to continue.</p>
        <button onClick={() => dispatch(closeModal())}>Close</button>
      </div>
    </div>
  );
}
