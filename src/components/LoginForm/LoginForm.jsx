import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login } from "../../redux/auth/operations";
import { Link } from "react-router-dom";
import css from "./LoginForm.module.css";
import Container from "../Container/Container";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").max(50).required("Required"),
  password: Yup.string().min(6).max(50).required("Required"),
});

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { resetForm }) => {
    const result = await dispatch(login(values));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/');
    }
    resetForm();
  };

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
          <Container variant="white">
            <Form className={css.container}>
              <h2 className={css.title}>Login</h2>
              <div className={css.form}>
                <label className={css.label}>
                <span className={css.text}>Enter your email address</span>
                <Field name="email" type="email" placeholder="email@gmail.com" className={css.input}/>
                <ErrorMessage name="email" component="div" />
              </label>
              <label className={css.label}>
                <span className={css.text}>Create a strong password</span>
                <Field name="password" type="password"  placeholder="********" className={css.input}/>
                <ErrorMessage name="password" component="div" />
              </label>
                <button type="submit" className={css.button}>Login</button>
                </div>
                    <p className={css.titlehint}>
                      Don’t have an account?
                      <Link to="/register" className={css.link}>
                        Register
                      </Link>
                    </p>
            </Form>
          </Container>
        </Formik>
  );
}