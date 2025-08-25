import { useDispatch, useSelector } from 'react-redux';
import { selectIsModalOpen } from '../../redux/modal/selectors.js';
import { useEffect } from 'react';
import { closeModal } from '../../redux/modal/slice.js';
import css from '../ModalNotAuthorized/ModalNotAuthorized.module.css';
import { useNavigate } from 'react-router-dom';

const ModalNotAuthorized = () => {
  const isOpen = useSelector(selectIsModalOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onEsc = (event) => event.key === 'Escape' && dispatch(closeModal());
    if (isOpen) {
      window.addEventListener('keydown', onEsc);
    }
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    dispatch(closeModal());
    navigate(path);
  };

  return (
    <div className={css.backdrop} onClick={() => dispatch(closeModal())}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button
          className={css.closeBtn}
          onClick={() => dispatch(closeModal())}
          aria-label="Close"
        >
          <svg className={css.icon} width="24" height="24">
            <use xlinkHref="/sprite/symbol-defs.svg#icon-close" />
          </svg>
        </button>

        <h2 className={css.title}>Not authorized</h2>
        <p className={css.text}>
          Please log in or register to open your account
        </p>

        <div className={css.action}>
          <button
            className={css.loginBtn}
            onClick={() => handleNavigate('/auth/login')}
          >
            Log in
          </button>
          <button
            className={css.registerBtn}
            onClick={() => handleNavigate('/auth/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalNotAuthorized;
