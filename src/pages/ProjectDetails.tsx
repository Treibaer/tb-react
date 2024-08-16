import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { Project } from "../models/project";
import ProjectService from "../services/ProjectService";

export const ProjectDetails: React.FC = () => {
  const project = useLoaderData() as Project;
  return (
    <>
      <nav>
        <NavLink to={`/`}>Home</NavLink>
        {" > "}
        <NavLink to={`/projects`}>Projects</NavLink>
        {" > "}
        {project.title}
      </nav>
      <div>
        <NavLink to={`/projects/${project.slug}/tickets`}>View Tickets</NavLink>
        <br></br>
        <NavLink to={`/projects/${project.slug}/tickets/all`}>All Tickets</NavLink>
        <br></br>
        <NavLink to={`/projects/${project.slug}/boards`}>Boards</NavLink>
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
  return await ProjectService.shared.loadProjectBySlug(
    params.projectSlug ?? ""
  );
};

export default ProjectDetails;
