import { NavLink } from 'react-router-dom';
import css from './Navigation.module.css';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import { useSelector } from 'react-redux';

export default function Navigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <nav className={css.nav}>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
      >
        Recipes
      </NavLink>

      {isLoggedIn && (
        <>
          <NavLink
            to="/user-profile"
            className={({ isActive }) =>
              isActive ? `${css.link} ${css.isActive}` : css.link
            }
          >
            My Profile
          </NavLink>
          <NavLink className={css.asBTN} to="/add-recipe">
            Add Recipe
          </NavLink>
        </>
      )}
    </nav>
  );
}
