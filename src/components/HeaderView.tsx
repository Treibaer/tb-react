import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "../models/breadcrumb";

export const HeaderView: React.FC<{ breadcrumbs: Breadcrumb[] }> = ({
  breadcrumbs,
}) => {
  return (
    <div className="flex gap-2 text-white border-b border-b-border p-4 h-14 overflow-x-auto select-none">

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
