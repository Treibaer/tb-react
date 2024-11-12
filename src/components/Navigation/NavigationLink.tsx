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
      data-cy={`nav-link-${title.toLowerCase().split(" ").join("-")}`}
      // className="hover:bg-[#262736] h-[27px] px-1 items-center flex rounded gap-2"
      className={({ isActive }) =>
        `hover:bg-hover h-[34px] px-1 items-center flex rounded gap-2 ${
          isActive ? "bg-hover" : undefined
        }`
      }
      end
    >
      {icon && <div style={{
        fontSize: "1.1rem",
      }}>{icon}</div>}
      {title}
    </NavLink>
  );
};

export default NavigationLink;
