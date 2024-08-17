import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { Project } from "../../models/project";
import ProjectService from "../../services/ProjectService";
import { ROUTES } from "../../routes";
import { Button } from "../../components/Button";

export const ProjectDetails: React.FC = () => {
  const project = useLoaderData() as Project;
  return (
    <>
      <nav>
        <NavLink to={ROUTES.HOME}>Home</NavLink>
        {" > "}
        <NavLink to={ROUTES.PROJECTS}>Projects</NavLink>
        {" > "}
        {project.title}
      </nav>
      <div>
        <NavLink to={ROUTES.TICKETS_BOARD_VIEW(project.slug)}>
          <Button title="View Tickets" />
          
        </NavLink>
        <NavLink to={ROUTES.TICKETS_LIST(project.slug)}>
          <Button title="All Tickets" />
        </NavLink>
        <NavLink to={ROUTES.BOARDS(project.slug)}>
          <Button title="Boards" />
        </NavLink>
      </div>
      <div className="project-details-wrapper">
        <h2>Title: {project.title}</h2>
        <p>Description: {project.description}</p>
      </div>
    </>
  );
};

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const { projectSlug } = params as { projectSlug: string };
  if (!projectSlug) {
    throw new Error("Project slug is missing");
  }
  return await ProjectService.shared.loadProjectBySlug(projectSlug);
};

export default ProjectDetails;
