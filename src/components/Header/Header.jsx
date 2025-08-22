import { Link } from 'react-router-dom';
import AuthNav from '../AuthNav/AuthNav.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';

export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header>
      <Link to="/">Tasteorama</Link>
      <div>
        <Navigation />
        <AuthNav />
        {/* {isLoggedIn ? <UserMenu /> : <AuthNav />} */}
      </div>
    </header>
  );
}
