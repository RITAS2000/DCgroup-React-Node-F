import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
// import TestModal from '../TestModal/TestModal.jsx';
import ReModalContainer from '../ReUseModal/ReModalContainer/ReModalContainer.jsx';

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      {/* <TestModal /> */}
      <ReModalContainer />
      <main className={css.main}>{children}</main>
      <Footer />
    </div>
  );
}
