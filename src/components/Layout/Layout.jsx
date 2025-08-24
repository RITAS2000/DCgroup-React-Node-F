import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';
import { Suspense, lazy } from 'react';
import ReModalContainer from '../ReUseModal/ReModalContainer/ReModalContainer.jsx';
import { ColorRing } from 'react-loader-spinner';

const Outlet = lazy(() => import('../Outlet/Outlet.jsx'));

export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />
      <ReModalContainer />
      <div className={css['outlet-container']}>
        <Suspense
          fallback={
            <ColorRing
              visible={true}
              height="120"
              width="120"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
            />
          }
        >
          <Outlet>{children}</Outlet>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}
