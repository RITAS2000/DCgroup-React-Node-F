import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import s from './ProfileNavigation.module.css';

export default function ProfileNavigation() {
  return (
    <nav className={s.tabs} role="tablist" aria-label="Recipe lists">
      <NavLink
        to="/profile/own"
        className={({ isActive }) => clsx(s.tabBtn, isActive && s.active)}
        role="tab"
        aria-selected={({ isActive }) => (isActive ? 'true' : 'false')}
      >
        My Recipes
      </NavLink>
      <NavLink
        to="/profile/favorites"
        className={({ isActive }) => clsx(s.tabBtn, isActive && s.active)}
        role="tab"
        aria-selected={({ isActive }) => (isActive ? 'true' : 'false')}
      >
        Saved Recipes
      </NavLink>
    </nav>
  );
}
