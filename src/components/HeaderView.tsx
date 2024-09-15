import { Bars3Icon } from "@heroicons/react/24/solid";
import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "../models/breadcrumb";

export const HeaderView: React.FC<{ breadcrumbs: Breadcrumb[] }> = ({
  breadcrumbs,
}) => {
  function showMenu() {
    const menu = document.getElementById("menu");
    if (!menu) {
      return;
    }
    menu.style.display = menu.style.display === "" ? "block" : "";
  }
  return (
    <div className="flex gap-2 text-white border-b border-b-slate-600 p-4 h-14 overflow-x-scroll select-none">
      <div>
        <Bars3Icon className="h-6 w-6 md:hidden text-[#ccccd7]" onTouchStart={showMenu}/>
      </div>
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.link}>
          {item.link && (
            <NavLink className="hover:text-[#ccccd7] text-nowrap" to={item.link}>
              {item.title}
            </NavLink>
          )}
          {!item.link && (
            <NavLink className="cursor-default text-nowrap" to={""}>
              {item.title}
            </NavLink>
          )}
          {index < breadcrumbs.length - 1 && <div> {">"} </div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default HeaderView;
