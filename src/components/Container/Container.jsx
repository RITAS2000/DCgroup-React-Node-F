import css from './Container.module.css';

export default function Container({ children, variant }) {
  let backgroundClass = '';
  if (variant === 'white') {
    backgroundClass = css.bgWhite;
  } else if (variant === 'brown') {
    backgroundClass = css.bgBrown;
  } else if (variant === 'transparent') {
    backgroundClass = css.bgTransparent;
  }
  return (
    <div className={`${css.container} ${backgroundClass}`}>{children}</div>
  );
}

// {
//   /* Приклад використання:
//     <Container variant="light">
//   <h1>Світлий фон</h1>
// </Container>

// <Container variant="dark">
//   <p>Темний фон</p>
// </Container> */
// }
