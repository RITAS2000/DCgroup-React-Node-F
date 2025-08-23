import css from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={css.container}>
      <div>
        <div className={css.logo}></div>
        <p>Tasteorama</p>
      </div>
      <h1>Footer</h1>
    </footer>
  );
}
