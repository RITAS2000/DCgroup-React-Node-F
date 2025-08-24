import { Field, ErrorMessage } from 'formik';

import css from './CategoryAndIngredientsSelect.module.css';

const CategoryAndIngredientsSelect = ({
  categories,
  placeholder,
  name,
  id,
}) => {
  return (
    <>
      <Field as="select" className={css.calorCategInput} name={name} id={id}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </Field>
      <ErrorMessage className={css.errorMsg} name={name} component="span" />
    </>
  );
};

export default CategoryAndIngredientsSelect;
