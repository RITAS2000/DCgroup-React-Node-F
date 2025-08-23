import s from './SearchBox.module.css';

export default function SearchBox() {
  const onSubmit = (e) => {
    e.preventDefault(); // позже подключим Formik/Redux
  };

  return (
    <form className={s.form} onSubmit={onSubmit} noValidate>
      <label htmlFor="q" className="visually-hidden">
        Search recipes
      </label>
      <input
        id="q"
        name="q"
        type="text"
        placeholder="Search recipes"
        className={s.input}
        autoComplete="off"
      />
      <button type="submit" className={s.btn}>
        Search
      </button>

      {/* место под текст ошибки (пока пусто) */}
      <span className={s.error} aria-live="polite"></span>
    </form>
  );
}
