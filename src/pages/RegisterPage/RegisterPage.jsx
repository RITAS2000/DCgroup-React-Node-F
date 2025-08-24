import RegistrationForm from "../../components/RegistrationForm/RegistrationForm";
import css from "./RegisterPage.module.css";

export default function RegisterPage() {
  return (
    <div>
      <h1 className={css.title}>Register</h1>
      <p>Join our community of culinary enthusiasts, save your favorite recipes, and share your cooking creations</p>
      <RegistrationForm />
    </div>
  );
}
