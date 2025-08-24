import Footer from '../Footer/Footer.jsx';
import Header from '../Header/Header.jsx';
import css from './Layout.module.css';


import ReModalContainer from '../ReUseModal/ReModalContainer/ReModalContainer.jsx';


import Main from '../Main/Main.jsx';


export default function Layout({ children }) {
  return (
    <div className={css.page}>
      <Header />

   
      <ReModalContainer />
      <main className={css.main}>{children}</main>

     
      <Main>{children}</Main>

      <Footer />
    </div>
  );
}
