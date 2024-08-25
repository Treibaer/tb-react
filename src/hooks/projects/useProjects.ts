import { useState } from "react";
import { Project } from "../../models/project";
import ProjectService from "../../services/ProjectService";

const projectService = ProjectService.shared;

export function useProjects() {
  const [isCreating, setIsCreating] = useState<boolean>(false);

  async function createProject(title: string) {
    const slug = title.toLowerCase().replace(/\s/g, "").substring(0, 2);
    const newProject: Project = {
      id: 0,
      slug,
      icon: "📒",
      description: "",
      title,
    };
    await projectService.create(newProject);
    setIsCreating(false);
  }

  return {
    isCreating,
    setIsCreating,
    createProject,
  };
}
