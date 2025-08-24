import css from './Outlet.module.css';
export default function Main({ children }) {
  return <main className={css.main}>{children}</main>;
}
