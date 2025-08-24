import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsLoggedIn } from '../../redux/auth/selectors.js';
import css from './FooterLink.module.css';
import { openModal } from '../../redux/modal/slice.js';

export default function FooterLink() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  const handleAccountClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      dispatch(openModal());
    }
  };

  return (
    <div className={css.container}>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
        to="/"
      >
        Recipes
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${css.link} ${css.isActive}` : css.link
        }
        to="/user-profile"
        onClick={handleAccountClick}
      >
        Account
      </NavLink>
    </div>
  );
}
