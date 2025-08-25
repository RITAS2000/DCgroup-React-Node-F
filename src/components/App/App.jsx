import { lazy, Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from '../Layout/Layout.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RecipeDetails from '../RecipeDetails/RecipeDetails.jsx';
import LoginForm from '../LoginForm/LoginForm.jsx';
import RegistrationForm from '../RegistrationForm/RegistrationForm.jsx';
import RecipesList from '../RecipesList/RecipesList.jsx';

const MainPage = lazy(() => import('../../pages/MainPage/MainPage.jsx'));
const AuthPage = lazy(() => import('../../pages/AuthPage/AuthPage.jsx'));
const AddRecipePage = lazy(() =>
  import('../../pages/AddRecipePage/AddRecipePage.jsx'),
);
const ProfilePage = lazy(() =>
  import('../../pages/ProfilePage/ProfilePage.jsx'),
);
const NotFoundPage = lazy(() =>
  import('../../pages/NotFoundPage/NotFoundPage.jsx'),
);

const RecipeViewPage = lazy(() =>
  import('../../pages/RecipeViewPage/RecipeViewPage.jsx'),
);

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<MainPage />} />

          <Route path="/recipes" element={<RecipeViewPage />}>
            <Route path=":id" element={<RecipeDetails />} />
          </Route>

          <Route path="/add-recipe" element={<AddRecipePage />} />

          <Route path="/profile" element={<ProfilePage />}>
            <Route path="own" element={<RecipesList type="own" />} />
            <Route
              path="favorites"
              element={<RecipesList type="favorites" />}
            />
          </Route>

          <Route path="/auth" element={<AuthPage />}>
            <Route path="register" element={<RegistrationForm />} />
            <Route path="login" element={<LoginForm />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <ToastContainer
        position="bottom-center"
        autoClose={2500}
        theme="colored"
      />
    </Layout>
  );
}
