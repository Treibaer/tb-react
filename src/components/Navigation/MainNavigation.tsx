import { useParams } from "react-router-dom";
import { ROUTES } from "../../routes";
// import classes from "./MainNavigation.module.css";
import NavigationLink from "./NavigationLink";

export default function MainNavigation() {
  const params: { projectSlug?: string } = useParams();

  return (
    <header className="w-full h-screen bg-[#191a23] px-2 pt-4 border-x border-[#2c2d3c]">
      <nav className="flex flex-col w-full">
        <NavigationLink to={ROUTES.HOME} title="Dashboard" />
        <NavigationLink to={ROUTES.PROJECTS} title="Projects" />
        {params.projectSlug && (
          <>
          <hr className="py-2" />
            <NavigationLink
              to={ROUTES.PROJECT_DETAILS(params.projectSlug)}
              title="Project Details"
            />
            <NavigationLink
              to={ROUTES.TICKETS_BOARD_VIEW(params.projectSlug)}
              title="Board View"
            />
            <NavigationLink
              to={ROUTES.BOARDS(params.projectSlug)}
              title="Boards"
            />
            <NavigationLink
              to={ROUTES.TICKETS_LIST(params.projectSlug)}
              title="Tickets List"
            />
          </>
        )}
      </nav>
    </header>
  );
}
