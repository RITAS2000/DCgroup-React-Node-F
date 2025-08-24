import css from './Footer.module.css';
import Logo from '../Logo/Logo.jsx';
import FooterLink from '../FooterLink/FooterLink.jsx';
import TestModalButtons from '../ReUseModal/ReTestBtn/ReTestBtn.jsx';

export default function Footer() {
  return (
    <footer className={css.container}>
      <Logo />
      <p className={css.textCooking}>
        © 2025 CookingCompanion. All rights reserved.
      </p>
      <TestModalButtons />
      <FooterLink />
    </footer>
  );
}
