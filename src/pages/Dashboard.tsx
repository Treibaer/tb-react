import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import HeaderView from "../components/HeaderView";
import { Breadcrumb } from "../models/breadcrumb";
import Constants from "../services/Constants";

export default function Dashboard() {
  const breadcrumbs: Breadcrumb[] = [{ title: "Home", link: "" }];

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-6xl text-center mt-8">Welcome!</div>
      <div className="flex flex-wrap my-2 mx-2 gap-2">
        <NavLink to="/projects">
          <Button title="Projects" />
        </NavLink>
        {!Constants.isDemoMode && (
          <>
            <NavLink to="/finances/details">
              <Button title="Finances" />
            </NavLink>
            <NavLink to="/passwords/1/entries">
              <Button title="Passwords" />
            </NavLink>
            <NavLink to="/projects/HK/tickets">
              <Button title="Board View" />
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}
