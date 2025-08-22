import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';

const HomePage = lazy(() => import('../../pages/HomePage/HomePage.jsx'));
const LoginPage = lazy(() => import('../../pages/LoginPage/LoginPage.jsx'));
const RegisterPage = lazy(() =>
  import('../../pages/RegisterPage/RegisterPage.jsx'),
);
const AddRecipePage = lazy(() =>
  import('../../pages/AddRecipePage/AddRecipePage.jsx'),
);
const ProfilePage = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage.jsx'),
);
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage.jsx'),
);

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} /> //рендерить hero і список
          рецептів
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-profile" element={<ProfilePage />} />
          <Route path="/add-recipe" element={<AddRecipePage />} />
          {/* <Route
            path="/recipes/:recipeId"
            element={<RecipeDetailsPage />}
          ></Route> */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}
