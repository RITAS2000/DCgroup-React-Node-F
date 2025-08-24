import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { register } from "../../redux/auth/operations";
import { Link } from "react-router-dom";
import css from "./RegistrationForm.module.css";

import * as Yup from "yup";


const validationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .max(16, "Name must be at most 16 characters")
    .required("Name is required"),
    
  email: Yup.string()
    .email("Invalid email address")
    .max(128, "Email must be at most 128 characters")
    .required("Email is required"),
    
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .required("Password is required"),
});

export default function RegistrationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
 
 
    const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm: "",
    };
    const handleSubmit = async (values, { resetForm }) => {
      const result = await dispatch(register(
        {
          name: values.name,
          email: values.email,
          password: values.password,
        }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/login'); 
    }

    resetForm();
    };
    return ( 
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          >
           <Form className={css.form}>
               <label>
                  Enter your name
                 <Field name="name" type="text" placeholder="Max"/>
               </label>
               <label>
                 Enter your email address
                <Field name="email" type="email" placeholder="email@gmail.com"/>
               </label>
               <label>
                Create a strong password
                 <Field name="password" type="password" placeholder="********" />
                </label>
                <label>
                 Repeat your password
                <Field name="confirm" type="password" placeholder="********" />
                </label>
                <ErrorMessage name="confirm" component="div" />
                <button type="submit">
                 Create account
                </button>
                <p className={css.registerhint}>
                Already have an account?
                <Link to="/login" className={css.registerlink}>
                  Log in
                </Link>
              </p>
          </Form>  
        </Formik>
    );
}
