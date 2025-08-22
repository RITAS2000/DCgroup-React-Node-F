import { NavLink } from 'react-router-dom';

export default function Navigation() {
  // const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <nav>
      <NavLink to="/">Recipes</NavLink>
      <NavLink to="/user-profile">My Profile</NavLink>
      <NavLink to="/add-recipe">Add Recipe</NavLink>
      {/* {isLoggedIn && (
        <>
          <NavLink to="/user-profile">My Profile</NavLink>
          <NavLink to="/add-recipe">Add Recipe</NavLink>
        </>
      )} */}
    </nav>
  );
}
