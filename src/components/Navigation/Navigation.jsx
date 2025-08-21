export default function Navigation() {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <nav>
      <NavLink to="/">Recipes</NavLink>
      {isLoggedIn && (
        <>
          <NavLink to="/user-profile">My Profile</NavLink>
          <NavLink to="/add-recipe">Add Recipe</NavLink>
        </>
      )}
    </nav>
  );
}
