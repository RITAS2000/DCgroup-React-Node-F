import css from './Container.module.css';

export default function Container({ children, variant }) {
  const backgroundClass = variant === 'light' ? css.bgLight : css.bgDark;
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
