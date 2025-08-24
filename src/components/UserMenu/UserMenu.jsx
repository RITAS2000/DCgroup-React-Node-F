import { useDispatch, useSelector } from 'react-redux';
import css from './UserMenu.module.css';
import { selectUser } from '../../redux/auth/selectors.js';
import { logout } from '../../redux/auth/operations.js';

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

      <button className={css.btnLogout} type="button" onClick={handleLogOut}>
        Logout
      </button>
    </div>
  );
}
