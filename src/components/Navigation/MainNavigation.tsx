import { useParams } from "react-router-dom";
import { ROUTES } from "../../routes";
import classes from "./MainNavigation.module.css";
import NavigationLink from "./NavigationLink";

export default function MainNavigation() {
  const params: { projectSlug?: string } = useParams();

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <NavigationLink to={ROUTES.HOME} title="Home" />
          <NavigationLink to={ROUTES.PROJECTS} title="Projects" />
        </ul>
        <ul className={classes.list}>
          {params.projectSlug && (
            <>
              <NavigationLink
                to={ROUTES.PROJECT_DETAILS("TL")}
                title="Project"
              />
              <NavigationLink
                to={ROUTES.TICKETS_BOARD_VIEW("TL")}
                title="Board View"
              />
              <NavigationLink to={ROUTES.BOARDS("TL")} title="Boards" />
              <NavigationLink
                to={ROUTES.TICKETS_LIST("TL")}
                title="Tickets List"
              />
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}
