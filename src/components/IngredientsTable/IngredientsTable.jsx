import css from './IngredientsTable.module.css';

const IngredientsTable = ({ ingredients, remove }) => {
  return (
    <table className={css.table}>
      <thead className={css.thead}>
        <tr className={css.tr}>
          <th className={css.th}>Name:</th>
          <th className={css.th}>Amount:</th>
          <th className={css.th}></th>
        </tr>
      </thead>
      <tbody className={css.tbody}>
        {ingredients.map((ingredient, index) => (
          <tr className={css.tr} key={ingredient.id}>
            <td className={css.td}>{ingredient.name}</td>
            <td className={css.td}>{ingredient.amount}</td>
            <td className={css.td}>
              <button
                className={css.btn}
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
