import AuthNav from '../AuthNav/AuthNav.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header>
      <a href="./index.html">Tasteorama</a>
      <div>
        <Navigation />
        <AuthNav />

        {/* {isLoggedIn ? <UserMenu /> : <AuthNav />} */}
      </div>
    </header>
  );
}
