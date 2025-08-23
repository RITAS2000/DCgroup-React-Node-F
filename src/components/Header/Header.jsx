import AuthNav from '../AuthNav/AuthNav.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header style={{backgroundColor: 'grey'}}>
      <a href="./index.html">
        <svg width="24" height="24">
          <use href="/sprite/symbol-defs.svg#icon-logo" />
        </svg>
        Tasteorama
      </a>
      <div>
        <Navigation />
        <AuthNav />

        {/* {isLoggedIn ? <UserMenu /> : <AuthNav />} */}
      </div>
    </header>
  );
}
