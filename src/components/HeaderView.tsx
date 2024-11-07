import React from "react";
import { NavLink } from "react-router-dom";
import { Breadcrumb } from "../models/breadcrumb";
import { Helmet } from "react-helmet-async";

export const HeaderView: React.FC<{
  breadcrumbs: Breadcrumb[];
  title?: string;
}> = ({ breadcrumbs, title }) => {
  if (!title && breadcrumbs.length > 0) {
    title = breadcrumbs[breadcrumbs.length - 1].title;
  }
  return (
    <div className="flex gap-2 text-white border-b border-b-border p-4 h-14 overflow-x-auto select-none">
      <Helmet title={title || "TB - React"} />
      {breadcrumbs.map((item, index) => (
        <React.Fragment key={item.link}>
          {item.link && (
            <NavLink
              className="hover:text-[#ccccd7] text-nowrap"
              to={item.link}
            >
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
