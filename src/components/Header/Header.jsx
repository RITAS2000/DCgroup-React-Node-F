import { useSelector } from 'react-redux';
import AuthNav from '../AuthNav/AuthNav.jsx';
import Logo from '../Logo/Logo.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import css from './Header.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';

export default function Header() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header className={css.container}>
      <Logo />
      <div className={css.nav}>
        <Navigation />
        {isLoggedIn ? <UserMenu /> : <AuthNav />}
      </div>
      <div className={css.burger}>svg</div>
    </header>
  );
}
