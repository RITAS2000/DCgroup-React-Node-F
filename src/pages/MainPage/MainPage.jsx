import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearResults } from '../../redux/recipes/slice';
import RecipesList from '../../components/RecipesList/RecipesList.jsx';
import Hero from '../../components/Hero/Hero.jsx';

export default function MainPage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearResults());
  }, [dispatch]);
  return (
    <>
      <Hero />
      <RecipesList />
    </>
  );
}
