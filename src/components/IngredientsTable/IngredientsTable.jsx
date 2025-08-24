import css from './IngredientsTable.module.css';

const IngredientsTable = ({ ingredients, remove }) => {
  return (
    <table className={css.table}>
      <thead>
        <tr>
          <th>Name:</th>
          <th>Amount:</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {ingredients.map((ingredient, index) => (
          <tr key={ingredient.id}>
            <td>{ingredient.name}</td>
            <td>{ingredient.amount}</td>
            <td>
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Remove ingredient"
              >
                ❌
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default IngredientsTable;
