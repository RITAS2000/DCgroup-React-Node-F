

import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';
import { ToastContainer } from 'react-toastify';
import PrivateRoute from '../PrivateRoute/PrivateRoute.jsx';

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

const RecipeDetailsPage = lazy(() =>
    import('../../pages/RecipeViewPage/RecipeViewPage.jsx'),
);

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-profile">
            <Route
              index
              element={<Navigate to="/user-profile/own" replace />}
            />
            <Route path=":recipeType" element={<ProfilePage />} />
          </Route>
          <Route path="/add-recipe" element={<AddRecipePage />} />
          <Route
            path="/recipes/:recipeId"
            element={<RecipeDetailsPage />}
          ></Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </Layout>
  );
}
