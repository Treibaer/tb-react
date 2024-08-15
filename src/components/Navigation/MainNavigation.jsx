import classes from "./MainNavigation.module.css";
import NavigationLink from "./NavigationLink";

export default function MainNavigation() {
  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <NavigationLink to="/" title="Home" />
          <NavigationLink to="/projects" title="Projects" />
          {/* <NavigationLink to="/tickets" title="Tickets" /> */}
        </ul>
      </nav>
    </header>
  );
}
