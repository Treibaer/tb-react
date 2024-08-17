import { ROUTES } from "../../routes";
import classes from "./MainNavigation.module.css";
import NavigationLink from "./NavigationLink";

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <NavigationLink to={ROUTES.HOME} title="Home" />
          <NavigationLink to={ROUTES.PROJECTS} title="Projects" />
          <NavigationLink to={ROUTES.PROJECT_DETAILS("TL")} title="Project" />
          <NavigationLink
            to={ROUTES.TICKETS_BOARD_VIEW("TL")}
            title="Tickets"
          />
        </ul>
      </nav>
    </header>
  );
}
