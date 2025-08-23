import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  selectIsAuthenticated,
  selectAuthLoading,
} from '../../redux/auth/selectors';

const REQUIRE_AUTH = import.meta.env.VITE_REQUIRE_AUTH === 'true';

export default function PrivateRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);

  if (!REQUIRE_AUTH) return <Outlet />;

  if (loading) return null;
  /*if (loading) return <div>Loading...</div>;*/

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
