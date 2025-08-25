import { useDispatch, useSelector } from 'react-redux';
import AuthNav from '../AuthNav/AuthNav.jsx';
import Logo from '../Logo/Logo.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import css from './Header.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import ModalMobileNav from '../ModalMobileNav/ModalMobileNav.jsx';
import { openBurger } from '../../redux/modal/burgerSlice.js';
import { selectBurgerOpen } from '../../redux/modal/selectors.js';

export default function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();
  const isOpen = useSelector(selectBurgerOpen);

  return (
    <header className={css.container}>
      <Logo />
      <div className={css.nav}>
        <Navigation />

        {isLoggedIn ? <UserMenu /> : <AuthNav />}
      </div>

      <div className={css.burger} onClick={() => dispatch(openBurger())}>
        <svg width="32" height="32">
          <use href="/sprite/symbol-defs.svg#icon-burger-menu" />
        </svg>
      </div>

      {isOpen && <ModalMobileNav />}
    </header>
  );
}
