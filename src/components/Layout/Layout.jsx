import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import ModalNotAuthorized from '../ModalNotAuthorized/ModalNotAuthorized.jsx';
import { Suspense, lazy } from 'react';
// import ReModalContainer from '../ReUseModal/ReModalContainer/ReModalContainer.jsx';
import { ClockLoader } from 'react-spinners';

const Outlet = lazy(() => import('../Outlet/Outlet.jsx'));

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      <ModalNotAuthorized />
      {/* <ReModalContainer /> */}
      <div className={css['outlet-container']}>
        <Suspense fallback={<ClockLoader color="#3d2218" size={300} />}>
          <Outlet>{children}</Outlet>
        </Suspense>
      </div>

      <Footer />
    </div>
  );
}
