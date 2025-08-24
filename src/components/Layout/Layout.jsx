import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';

import ReModalContainer from '../ReUseModal/ReModalContainer/ReModalContainer.jsx';

import Outlet from '../Outlet/Outlet.jsx';

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      <ReModalContainer />
      <Outlet>{children}</Outlet>
      <Footer />
    </div>
  );
}
