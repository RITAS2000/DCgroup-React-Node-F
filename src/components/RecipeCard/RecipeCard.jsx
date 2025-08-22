import css from './RecipeCard.module.css';

export default function RecipeCard({
  thumb,
  title,
  time,
  description,
  calories,
}) {
  return (
    <div className={css.card}>
      <img className={css.image} src={thumb} alt={title} />
      <div className={css.title_container}>
        <h3 className={css.title}>{title}</h3>
        <div className={css.time_container}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 7.61537V12.5481L15.2885 15.2884M19.125 12C19.125 15.935 15.935 19.125 12 19.125C8.06497 19.125 4.875 15.935 4.875 12C4.875 8.06497 8.06497 4.875 12 4.875C15.935 4.875 19.125 8.06497 19.125 12Z"
              stroke="black"
              stroke-width="0.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <p className={css.time}>{time}</p>
        </div>
      </div>
      <div className={css.descr_cont}>
        <p className={css.description1}>{description}</p>
        <p className={css.description2}>~{calories ?? 'N/A'} cals</p>
      </div>
      <div className={css.btn_cont}>
        <button>Learn more</button>
        <button>S</button>
      </div>
    </div>
  );
}
