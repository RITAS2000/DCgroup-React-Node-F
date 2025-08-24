import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/auth/operations";
import { selectUser } from "../../redux/auth/selectors";import css from './UserMenu.module.css';

export default function UserMenu() {
     const dispatch = useDispatch();
     const user = useSelector(selectUser);

    const handleLogOut = () => {
      dispatch(logout());
     };
  return (
    <div className={css.userMenu}>
      <div className={css.userName}>
        <div className={css.letter}>{user.name.charAt(0)}</div>
        <span>{user.name}</span>
      </div>

      <div className={css.separator}></div>

      <button className={css.btnLogout}>Logout</button>
      <button className={css.logoutBtn} type="button" onClick={handleLogOut}>
        Logout
      </button> 
    </div>
  );
}
