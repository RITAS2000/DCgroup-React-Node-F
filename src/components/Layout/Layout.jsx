import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import TestModal from '../TestModal/TestModal.jsx';

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      <TestModal />
      <main className={css.main}>{children}</main>
      <Footer />
    </div>
  );
}
