import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import ProjectCard from "../../components/projects/ProjectCard";
import ProjectCreationDialog from "../../components/projects/ProjectCreationDialog";
import TitleView from "../../components/TitleView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/projectService";

const projectService = ProjectService.shared;

export default function ProjectList() {
  const [isCreating, setIsCreating] = useState(false);
  const data = useLoaderData() as Project[];
  const [projects, setProjects] = useState<Project[]>(data);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: "" },
  ];

  function openDialog() {
    setIsCreating(true);
  }

  async function onClose() {
    setIsCreating(false);
    // always refresh projects
    setProjects(await projectService.getAll());
  }

  return (
    <div>
      <AnimatePresence>
        {isCreating && <ProjectCreationDialog onClose={onClose} />}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Projects" openDialog={openDialog} />
      <div className="flex flex-wrap mx-2 gap-2 justify-center mt-2">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async () => {
  return await projectService.getAll();
};
