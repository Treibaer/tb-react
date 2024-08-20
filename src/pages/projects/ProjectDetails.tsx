import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { Button } from "../../components/Button";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";

export const ProjectDetails: React.FC = () => {
  const project = useLoaderData() as Project;
  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: "" },
  ];
  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
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
  return await ProjectService.shared.getProject(projectSlug);
};

export default ProjectDetails;
