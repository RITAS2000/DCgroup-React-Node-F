import { NavLink } from 'react-router-dom';
import css from './AuthNav.module.css';

export default function AuthNav() {
  return (
    <div className={css.authNav}>
      <NavLink
        to="/login"
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
      >
        Log in
      </NavLink>
      <NavLink className={css.asBTN} to="/register">
        Register
      </NavLink>
    </div>
  );
}
