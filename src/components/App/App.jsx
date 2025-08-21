import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import NotFoundPage from '../../pages/NotFoundPage/NotFoundPage.jsx';
import LoginPage from '../../pages/LoginPage/LoginPage.jsx';
import RegisterPage from '../../pages/RegisterPage/RegisterPage.jsx';
import HomePage from '../../pages/HomePage/HomePage.jsx';
import Layout from '../Layout/Layout.jsx';
import AddRecipePage from '../../pages/AddRecipePage/AddRecipePage.jsx';
import ProfilePage from '../../pages/ProfilePage/ProfilePage.jsx';

export default function App() {
  return (
    <Layout>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<HomePage />} />
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
