import s from './SearchBox.module.css';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const SearchSchema = Yup.object().shape({
  q: Yup.string().required('Required'),
});

export default function SearchBox() {
  const initValues = { q: '' };
  const onSubmit = async (values) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={initValues}
      onSubmit={onSubmit}
      validationSchema={SearchSchema}
    >
      {({ errors, touched }) => (
        <Form className={s.searchbox}>
          <div className="form-field">
            <Field
              name="q"
              type="text"
              placeholder="Search recipes"
              className={`${s.input} ${errors.q && touched.q ? s.error : ''}`}
              autoComplete="off"
            />
            {errors.q && touched.q ? (
              <span className={s.error} aria-live="polite">
                {errors.q}
              </span>
            ) : null}
          </div>
          <button type="submit" className={s.btn}>
            Search
          </button>
        </Form>
      )}
    </Formik>
  );
}
