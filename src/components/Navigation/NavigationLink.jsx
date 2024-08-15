import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";

export default function NavigationLink({ to, title }) {
  return (
    <li>
    <NavLink
      to={to}
      className={({ isActive }) => (isActive ? classes.active : undefined)}
      end
    >
      {title}
    </NavLink>
    </li>
  );
}
