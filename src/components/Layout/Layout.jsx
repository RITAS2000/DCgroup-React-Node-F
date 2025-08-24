import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import { Suspense, lazy } from 'react';

const ReModalContainer = lazy(() =>
  import('../ReUseModal/ReModalContainer/ReModalContainer.jsx'),
);
const Outlet = lazy(() => import('../Outlet/Outlet.jsx'));

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      <Suspense fallback={<div>Завантаження модалки...</div>}>
        <ReModalContainer />
      </Suspense>
      <Suspense fallback={<div>Завантаження контенту...</div>}>
        <Outlet>{children}</Outlet>
      </Suspense>
      <Footer />
    </div>
  );
}
