import SaveRecipeButton from '../saveRecipeButton/saveRecipeButton.jsx';
import css from './RecipeDetails.module.css'



export default function RecipeDetails({ details }) {

// const recipeId = details.id;
console.log('details', details);


const descriptionWithParagraphs = details.instructions.replaceAll('\n', '\n\n');
return (
<div className={css.box} >
  <div className={css.holder}>
    <img className={css.image} alt={details.title} src={details.thumb} />
    <h2 className={css.title}>{details.title}</h2>
  </div>

  <div>
    <div>
      <div className={css.wrap}>
        <h3 className={css.caption}>General informations</h3>
        <p className={css.text}><strong>Category:</strong> {details.category}</p>
        <p className={css.text}><strong>Cooking time:</strong> {details.time}</p>
        <p className={css.text}><strong>Caloric content:</strong> {details.calory ? details.calory : 'N/A'}</p>
      </div>
      <SaveRecipeButton recipeId={details._id}/>
    </div>


    <div>
      <h3 className={css.subtitle}>About recipe</h3>
      <p className={`${css.text} ${css.paragraph}`}>{details.description}</p>

      <h3 className={css.subtitle}>Ingredients:</h3>
      <ul className={css.list}>
        {details.ingredients.map((ingredient) => (
                <li key={ingredient.id} className={css.text}>{ingredient.id} — {ingredient.measure}</li>

        ))}
      </ul>

      <h3 className={css.subtitle}>Preparation Steps:</h3>
      <p className={css.desc}>{descriptionWithParagraphs}</p>
    </div>
  </div>

</div>

  )
};
