import { NavLink, To } from "react-router-dom";
import classes from "./MainNavigation.module.css";

export const NavigationLink: React.FC<{ to: To; title: string }> = ({
  to,
  title,
}) => {
  return (
    <NavLink
      to={to}
      className="hover:bg-[#262736] h-[27px] px-1 items-center flex rounded gap-2"
      end
    >
      {title}
    </NavLink>
  );
};

export default NavigationLink;
