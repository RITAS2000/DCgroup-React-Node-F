import { NavLink } from 'react-router-dom';
import css from './Navigation.module.css';

export default function Navigation() {
  // const isLoggedIn = useSelector(selectIsLoggedIn);

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
      {/* {isLoggedIn && (
        <>
          <NavLink to="/user-profile">My Profile</NavLink>
          <NavLink to="/add-recipe">Add Recipe</NavLink>
        </>
      )} */}
    </nav>
  );
}
