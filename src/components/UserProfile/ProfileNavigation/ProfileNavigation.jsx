import { NavLink } from 'react-router-dom';
import s from './ProfileNavigation.module.css';

export default function ProfileNavigation() {
  return (
    <nav className={s.tabs} role="tablist" aria-label="Recipe lists">
      <NavLink
        to="/profile/own"
        className={({ isActive }) => `${s.tabBtn} ${isActive ? s.active : ''}`}
        role="tab"
        aria-selected
      >
        My Recipes
      </NavLink>
      <NavLink
        to="/profile/favorites"
        className={({ isActive }) => `${s.tabBtn} ${isActive ? s.active : ''}`}
        role="tab"
        aria-selected
      >
        Saved Recipes
      </NavLink>
    </nav>
  );
}
