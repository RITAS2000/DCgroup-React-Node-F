import { useParams } from 'react-router-dom';
import s from './ProfilePage.module.css';

import ProfileNavigation from '../../components/UserProfile/ProfileNavigation/ProfileNavigation.jsx';
import UserRecipesList from '../../components/UserProfile/UserRecipesList/UserRecipesList.jsx';

export default function ProfilePage() {
  const { recipeType = 'own' } = useParams();
  const type = recipeType === 'favorites' ? 'favorites' : 'own';

  return (
    <section className={s.wrap}>
      <header className={s.header}>
        <h1 className={s.h1}>My profile</h1>
        <ProfileNavigation active={type} />
      </header>

      {type === 'own' && <UserRecipesList type="own" />}
      {type === 'favorites' && <UserRecipesList type="favorites" />}
    </section>
  );
}
