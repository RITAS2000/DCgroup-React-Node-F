import { useDispatch, useSelector} from "react-redux";
import { closeModal } from "../../redux/modal/slice.js";
import css from "../../components/ModalLogoutConfirm/ModalLogoutConfirm.module.css"
import { selectIsModalOpen } from "../../redux/modal/selectors.js";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logout } from "../../redux/auth/operations.js";

const ModalLogoutConfirm = () => {
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

   const handleConfirm = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(closeModal())
      navigate('/');
    } catch (e) {
      // показать toast/error при желании
      console.error(e);
    }
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

        <h2 className={css.title}>Are you sure?</h2>
        <p className={css.text}>
          We will miss you!
        </p>

        <div className={css.action}>
          <button
            className={css.logoutBtn}
            onClick={() => handleConfirm('/recipes')}
          >
            Log out
          </button>
          <button
            className={css.cancelBtn}
            onClick={() => dispatch(closeModal())}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogoutConfirm;