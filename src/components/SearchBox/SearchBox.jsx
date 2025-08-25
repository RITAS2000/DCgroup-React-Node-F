import s from './SearchBox.module.css';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { searchRecipes } from '../../redux/recipes/operations';
import { toast } from 'react-hot-toast';

const Schema = Yup.object({
  q: Yup.string().trim().min(2, 'мінімум 2 символи').required('Required'),
});

export default function SearchBox() {
  const dispatch = useDispatch();

  const initValues = { q: '' };

  const onSubmit = async (values, actions) => {
    try {
      const q = values.q.trim();
      if (!q) {
        actions.setSubmitting(false);
        return;
      }

      const res = await dispatch(searchRecipes({ title: q, page: 1 })).unwrap();

      if (!res.recipes || res.recipes.length === 0) {
        toast('Not found');
      }
    } catch (e) {
      toast.error(e);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initValues}
      validationSchema={Schema}
      onSubmit={onSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className={s.searchbox}>
          <div className="form-field">
            <Field
              name="q"
              type="text"
              placeholder="Search recipes"
              className={`${s.input} ${errors.q && touched.q ? s.error : ''}`}
            />
            {errors.q && touched.q && (
              <span className={s.error}>{errors.q}</span>
            )}
          </div>
          <button type="submit" className={s.btn} disabled={isSubmitting}>
            Search
          </button>
        </Form>
      )}
    </Formik>
  );
}
