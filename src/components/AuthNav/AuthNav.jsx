import { NavLink } from 'react-router-dom';

export default function AuthNav() {
  return (
    <div>
      <NavLink to="/login">Log in</NavLink>
      <NavLink to="/register">Register</NavLink>
    </div>
  );
}
