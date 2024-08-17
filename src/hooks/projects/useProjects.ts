import { useEffect, useState } from "react";
import ProjectService from "../../services/ProjectService";
import { Project } from "../../models/project";

const projectService = ProjectService.shared;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      const loadedProjects = await projectService.loadProjects();
      setProjects(loadedProjects);
    }
    fetchProjects();
  }, []);

  async function createProject(title: string) {
    const slug = title.toLowerCase().replace(/\s/g, "").substring(0, 2);
    const newProject: Project = {
      id: 0,
      slug,
      description: "",
      title,
    };
    await projectService.createProject(newProject);
    setProjects((prevProjects) => [...prevProjects, newProject]);
    setIsCreating(false);
  }

  return {
    projects,
    isCreating,
    setIsCreating,
    createProject,
  };
}
