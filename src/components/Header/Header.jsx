import { useDispatch, useSelector } from 'react-redux';
import AuthNav from '../AuthNav/AuthNav.jsx';
import Logo from '../Logo/Logo.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import css from './Header.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import { selectModal } from '../../redux/modal/selectors.js';
import { openModal } from '../../redux/modal/slice.js';
import ModalMobileNav from '../ModalMobileNav/ModalMobileNav.jsx';

export default function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const modal = useSelector(selectModal);
  const dispatch = useDispatch();

  return (
    <header className={css.container}>
      <Logo />
      <div className={css.nav}>
        <Navigation />
        {isLoggedIn ? <UserMenu /> : <AuthNav />}
      </div>

      <div
        className={css.burger}
        onClick={() => dispatch(openModal({ type: 'mobileMenu' }))}
      >
        svg
      </div>

      {modal.isOpen && modal.type === 'mobileMenu' && <ModalMobileNav />}
    </header>
  );
}
