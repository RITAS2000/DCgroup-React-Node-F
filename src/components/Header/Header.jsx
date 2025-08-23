import AuthNav from '../AuthNav/AuthNav.jsx';
import Logo from '../Logo/Logo.jsx';
import Navigation from '../Navigation/Navigation.jsx';
import UserMenu from '../UserMenu/UserMenu.jsx';
import css from './Header.module.css';

export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (

//     <header style={{backgroundColor: 'grey'}}>
//       <a href="./index.html">
//         <svg width="24" height="24">
//           <use href="/sprite/symbol-defs.svg#icon-logo" />
//         </svg>
//         Tasteorama
//       </a>
//       <div>

    <header className={css.container}>
      <Logo />
      <div className={css.nav}>

        <Navigation />
        <UserMenu />

        {/* {isLoggedIn ? <UserMenu /> : <AuthNav />} */}
      </div>
      <div className={css.burger}>svg</div>
    </header>
  );
}
