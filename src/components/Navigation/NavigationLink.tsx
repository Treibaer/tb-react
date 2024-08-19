import { NavLink, To } from "react-router-dom";
import classes from "./MainNavigation.module.css";

export const NavigationLink: React.FC<{ to: To; title: string }> = ({
  to,
  title,
}) => {
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
};

export default NavigationLink;
