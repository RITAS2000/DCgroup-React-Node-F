export default function Header() {
  //   const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <header>
      <a href="./index.html">Tasteorama</a>
      <div>
        <Navigation />
        {isLoggedIn ? <UserMenu /> : <AuthNav />}
      </div>
    </header>
  );
}
