import css from './Logo.module.css';
export function Logo() {
  return (
    <div className={css.continer}>
      <div className={css.logo}></div>
      <p className={css.text}>Tasteorama</p>
    </div>
  );
}
