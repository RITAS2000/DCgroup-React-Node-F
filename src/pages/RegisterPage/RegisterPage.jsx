import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import Container from "../../components/Container/Container";
import css from "./RegisterPage.module.css";

export default function RegisterPage() {
  return (
    <Container variant="white">
      <div className={css.container}>
        <h1 className={css.title}>Register</h1>
        <p className={css.text}>Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations</p>
        <RegistrationForm />
      </div>
    </Container>
  );
}
