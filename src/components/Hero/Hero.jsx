import s from './Hero.module.css';
import heroDesk from '../../images/hero-desk.jpg'; // твой файл в src/images
import SearchBox from './SearchBox';

export default function Hero() {
  return (
    <section
      className={s.hero}
      style={{ backgroundImage: `url(${heroDesk})` }}
      aria-label="Hero"
    >
      <div className={s.overlay} />
      <div className={s.content}>
        <h1 className={s.title}>
          Plan, Cook, and
          <br />
          Share Your
          <br />
          Flavors
        </h1>

        {/* пока без логики — только UI */}
        <SearchBox />
      </div>
    </section>
  );
}
