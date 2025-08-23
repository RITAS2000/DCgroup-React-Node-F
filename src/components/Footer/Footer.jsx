import { NavLink } from 'react-router-dom';
import css from './Footer.module.css';
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import { Logo } from '../Logo/Logo.jsx';

export default function Footer() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return (
    <footer className={css.container}>
      <Logo />
      <p className={css.textCooking}>
        © 2025 CookingCompanion. All rights reserved.
      </p>
      <div>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${css.link} ${css.isActive}` : css.link
          }
          to="/"
        >
          Recipes
        </NavLink>
        {/* {isLoggedIn && ( */}
        <NavLink
          className={({ isActive }) =>
            isActive ? `${css.link} ${css.isActive}` : css.link
          }
          to="/user-profile"
        >
          Account
        </NavLink>
        {/* )} */}
      </div>
    </footer>
  );
}
