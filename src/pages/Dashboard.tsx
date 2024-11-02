import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import HeaderView from "../components/HeaderView";
import { Breadcrumb } from "../models/breadcrumb";
import Constants from "../services/Constants";
import { ROUTES } from "../routes";

export default function Dashboard() {
  const breadcrumbs: Breadcrumb[] = [{ title: "Home", link: "" }];

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-6xl text-center mt-8">Welcome!</div>
      <div className="flex flex-wrap my-2 mx-2 gap-2">
        <NavLink to={ROUTES.PROJECTS}>
          <Button title="Projects" />
        </NavLink>
        {!Constants.isDemoMode && (
          <>
            <NavLink to={ROUTES.FINANCE_DETAILS}>
              <Button title="Finances" />
            </NavLink>
            <NavLink to={ROUTES.PASSWORDS_ENTRIES(1)}>
              <Button title="Passwords" />
            </NavLink>
            <NavLink to={ROUTES.TICKETS_BOARD_VIEW("HK")}>
              <Button title="HK" />
            </NavLink>
            <NavLink to={ROUTES.ASSETS}>
              <Button title="Assets" />
            </NavLink>
          </>
        )}
      </div>
    </>
  );
}

