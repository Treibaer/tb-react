import { ReactNode } from "react";
import { NavLink, To } from "react-router-dom";

export const NavigationLink: React.FC<{
  to: To;
  title: string;
  icon?: ReactNode;
}> = ({ to, title, icon }) => {
  return (
    <NavLink
      to={to}
      // className="hover:bg-[#262736] h-[27px] px-1 items-center flex rounded gap-2"
      className={({ isActive }) =>
        `hover:bg-mediumBlue3 h-[27px] px-1 items-center flex rounded gap-2 ${
          isActive ? "bg-mediumBlue3" : undefined
        }`
      }
      end
    >
      {icon && <div className="w-4 h-4">{icon}</div>}
      {title}
    </NavLink>
  );
};

export default NavigationLink;
