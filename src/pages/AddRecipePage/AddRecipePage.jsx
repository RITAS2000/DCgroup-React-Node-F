import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FieldArray,
  useFormikContext,
} from 'formik';
import { useId } from 'react';
import { useDispatch } from 'react-redux';
// import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import css from './AddRecipePage.module.css';
import { FeedbackSchema } from './FeedbackSchema.js';
import CategoryAndIngredientsSelect from '../../components/CategoryAndIngredientsSelect/CategoryAndIngredientsSelect.jsx';
import categories from './categoriesTemp.json';
import ingredients from './ingredientsTemp.json';
import IngredientsTable from '../../components/IngredientsTable/IngredientsTable.jsx';
import { addRecipe } from '../../redux/addRecipe/operations.js';
import Container from '../../components/Container/Container.jsx';

const AddRecipePage = () => {
  const photoId = useId();
  const titleFieldId = useId();
  const descriptionFieldId = useId();
  const timeFieldId = useId();
  const caloriesFieldId = useId();
  const categoryFieldId = useId();
  const ingredientsNameFieldId = useId();
  const amountFieldId = useId();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialValues = {
    photo: null,
    title: '',
    description: '',
    time: '',
    calories: '',
    category: '',
    ingredientsName: '',
    amount: '',
    ingredients: [],
    instructions: '',
  };

  const handleSubmit = async (values, actions) => {
    const formData = new FormData();

    const sanitizedIngredients = values.ingredients.map(({ name, amount }) => ({
      name,
      amount,
    }));

    for (const key in values) {
      if (key === 'ingredients') {
        formData.append(key, JSON.stringify(sanitizedIngredients));
      } else if (key === 'photo' && values.photo) {
        formData.append(key, values.photo); // File
      } else if (key !== 'ingredientsName' && key !== 'amount') {
        formData.append(key, values[key]);
      }
    }
    try {
      const result = await dispatch(addRecipe(formData)).unwrap();
      // toast.success('Recipe added successfully!');
      actions.resetForm();
      navigate(`/recipes/${result.data._id}`);
    } catch {
      // toast.error('Failed to add recipe. Please try again.');
    }
  };

  return (
    <Container variant="transparent">
      <h2 className={css.mainTitle}>Add Recipe</h2>
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        onSubmit={handleSubmit}
        validationSchema={FeedbackSchema}
      >
        {({ values, setFieldValue }) => (
          <Form className={css.form}>
            <div className={css.photoWrapper}>
              <h3>Upload Photo</h3>
              <input
                id={photoId}
                name="photo"
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setFieldValue('photo', event.currentTarget.files[0]);
                }}
                className={css.hiddenInput}
              />

              <label htmlFor={photoId} className={css.uploadBox}>
                {values.photo ? (
                  <img
                    src={URL.createObjectURL(values.photo)}
                    alt="Preview"
                    className={css.previewImage}
                  />
                ) : (
                  <div className={css.placeholder}>
                    <span className={css.uploadIcon}>📷</span>
                    {/* або SVG, або будь-яка інша іконка */}
                  </div>
                )}
              </label>
              <ErrorMessage
                className={css.errorMsg}
                name="photo"
                component="span"
              />
            </div>
            <fieldset className={css.fieldset}>
              <legend>General Information</legend>
              <div className={css.titleWrapper}>
                <label className={css.label} htmlFor={titleFieldId}>
                  Recipe Title
                </label>
                <Field
                  className={css.input}
                  type="text"
                  name="title"
                  id={titleFieldId}
                  placeholder="Enter the name of your recipe"
                />
                <ErrorMessage
                  className={css.errorMsg}
                  name="title"
                  component="span"
                />
              </div>

              <div className={css.descrWrapper}>
                <label className={css.label} htmlFor={descriptionFieldId}>
                  Recipe Description
                </label>
                <Field
                  as="textarea"
                  className={css.textarea}
                  name="description"
                  id={descriptionFieldId}
                  placeholder="Enter a brief description of your recipe"
                />
                <ErrorMessage
                  className={css.errorMsg}
                  name="description"
                  component="span"
                />
              </div>

              <div className={css.timeWrapper}>
                <label className={css.label} htmlFor={timeFieldId}>
                  Cooking time in minutes
                </label>
                <Field
                  className={css.input}
                  type="number"
                  name="time"
                  id={timeFieldId}
                  placeholder="10"
                />
                <ErrorMessage
                  className={css.errorMsg}
                  name="time"
                  component="span"
                />
              </div>

              <div className={css.calorCategWrapper}>
                <div className={css.calorWrapper}>
                  <label className={css.label} htmlFor={caloriesFieldId}>
                    Calories
                  </label>
                  <Field
                    className={css.calorCategInput}
                    type="number"
                    name="calories"
                    id={caloriesFieldId}
                    placeholder="150"
                  />
                  <ErrorMessage
                    className={css.errorMsg}
                    name="calories"
                    component="span"
                  />
                </div>

                <div className={css.categoryWrapper}>
                  <label className={css.label} htmlFor={categoryFieldId}>
                    Category
                  </label>
                  <CategoryAndIngredientsSelect
                    categories={categories}
                    placeholder="Soup"
                    name="category"
                    id={categoryFieldId}
                  />
                </div>
              </div>
            </fieldset>

            <fieldset className={css.fieldset}>
              <legend>Ingredients</legend>
              <div className={css.ingredientsWrapper}>
                <label className={css.label} htmlFor={ingredientsNameFieldId}>
                  Name
                </label>
                <CategoryAndIngredientsSelect
                  categories={ingredients}
                  placeholder="Broccoli"
                  name="ingredientsName"
                  id={ingredientsNameFieldId}
                />
              </div>

              <div className={css.amountWrapper}>
                <label className={css.label} htmlFor={amountFieldId}>
                  Amount
                </label>
                <Field
                  className={css.input}
                  type="text"
                  name="amount"
                  id={amountFieldId}
                  placeholder="100g"
                />
                <ErrorMessage
                  className={css.errorMsg}
                  name="amount"
                  component="span"
                />
              </div>

              <FieldArray name="ingredients">
                {({ push, remove }) => (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const name = values.ingredientsName.trim();
                        const amount = values.amount.trim();

                        const selectedIngredient = ingredients.find(
                          (ing) => ing.name === name,
                        );

                        push({ id: selectedIngredient._id, name, amount });
                        setFieldValue('ingredientsName', '');
                        setFieldValue('amount', '');
                      }}
                    >
                      Add new Ingredient
                    </button>

                    {values.ingredients.length > 0 && (
                      <IngredientsTable
                        ingredients={values.ingredients}
                        remove={remove}
                      />
                    )}
                  </>
                )}
              </FieldArray>
              <ErrorMessage
                className={css.errorMsg}
                name="ingredients"
                component="span"
              />
            </fieldset>

            <div className={css.instructWrapper}>
              <Field
                className={css.input}
                type="text"
                name="instructions"
                placeholder="Enter a text"
              />
              <ErrorMessage
                className={css.errorMsg}
                name="instructions"
                component="span"
              />
            </div>
            <div className={css.btnWrapper}>
              <button className={css.btn} type="submit">
                Publish Recipe
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddRecipePage;
