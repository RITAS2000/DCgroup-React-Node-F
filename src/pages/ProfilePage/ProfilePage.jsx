import { useParams } from 'react-router-dom';
import s from './ProfilePage.module.css';

import ProfileNavigation from '../../components/UserProfile/ProfileNavigation/ProfileNavigation.jsx';
import UserRecipesList from '../../components/UserProfile/UserRecipesList/UserRecipesList.jsx';

export default function ProfilePage() {
  const { recipeType } = useParams();

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <ProfileNavigation active={recipeType} />
      </header>

      {recipeType === 'own' && <UserRecipesList type="own" />}
      {recipeType === 'favorites' && <UserRecipesList type="favorites" />}
    </section>
  );
}
