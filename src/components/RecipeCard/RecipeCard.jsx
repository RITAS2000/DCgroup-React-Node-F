import css from './RecipeCard.module.css';

export default function RecipeCard({
  thumb,
  title,
  time,
  description,
  calories,
}) {
  return (
    <div>
      <img src={thumb} alt={title} />
      <h3>{title}</h3>
      <p>{time} min</p>
      <p>{description}</p>
      <p>~{calories ?? 'N/A'} cals</p>
      <button>Learn more</button>
      <button>S</button>
    </div>
  );
}
