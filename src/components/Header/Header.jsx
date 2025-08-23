import AuthNav from "../AuthNav/AuthNav.jsx";

export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header>
      <a href="./index.html">Tasteorama</a>
      <div>
        {/* <Navigation /> */}
        <AuthNav />

        {/* {isLoggedIn ? <UserMenu /> : <AuthNav />} */}
      </div>
    </header>
  );
}
