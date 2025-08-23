import { Link } from 'react-router-dom';
import css from './Logo.module.css';
export default function Logo() {
  return (
    <Link className={css.continer} to="/">
      <div className={css.logo}></div>
      <p className={css.text}>Tasteorama</p>
    </Link>
  );
}
