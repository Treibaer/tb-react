import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import ProjectCard from "../../components/projects/ProjectCard";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import ProjectCreationDialog from "./ProjectCreationDialog";

const projectService = ProjectService.shared;

export default function Projects() {
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as Project[];
  const [projects, setProjects] = useState<Project[]>(data);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: "" },
  ];
  document.title = "Projects";

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose() {
    setIsCreating(false);
    // refresh projects always
    setProjects(await projectService.getProjects());
  }

  return (
    <div>
      {isCreating && <ProjectCreationDialog onClose={onClose} />}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Projects" openDialog={openDialog} />
      <div className="flex flex-wrap">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async () => {
  return await projectService.getProjects();
};
