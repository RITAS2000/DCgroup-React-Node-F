export default function UserMenu() {
  //   const dispatch = useDispatch();
  //   const user = useSelector(selectUser);

  //   const handleLogOut = () => {
  //     dispatch(logout());
  //   };
  const user = {
    name: 'Max',
  };
  return (
    <div>
      <div>{user.name.charAt(0)}</div>
      <span>{user.name}</span>
      <div>|</div>
      <button>Logout</button>
      {/* <button className={css.logoutBtn} type="button" onClick={handleLogOut}>
        Logout
      </button> */}
    </div>
  );
}
