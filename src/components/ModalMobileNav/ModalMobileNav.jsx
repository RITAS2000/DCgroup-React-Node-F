import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/modal/slice.js';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import AuthNav from '../AuthNav/AuthNav.jsx';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import css from './ModalMobileNav.module.css';

export default function ModalMobileNav() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleClose = () => dispatch(closeModal());

  return (
    <div className={css.overlay} onClick={handleClose}>
      <div className={css.menu} onClick={(e) => e.stopPropagation()}>
        <button className={css.close} onClick={handleClose}>
          ✕
        </button>

        <nav className={css.nav}>
          <Navigation />
          {isLoggedIn ? <UserMenu /> : <AuthNav />}
        </nav>
      </div>
    </div>
  );
}
