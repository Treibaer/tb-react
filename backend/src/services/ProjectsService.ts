import fs from "fs";
import path from 'path';
import { Project } from "../Models";

// Directory path
const dir: string = path.join(process.cwd(), 'data');
const projectsPath = path.join(dir, 'projects.json');

export default class ProjectsService {
  static shared = new ProjectsService();

  private constructor() {}

  async loadProject(id: number): Promise<Project | undefined> {
    const projects = await this.loadProjects();
    return projects.find((d) => d.id === id);
  }

  async saveProject(project: Project): Promise<void> {
    const projects = await this.loadProjects();
    const existingProject = projects.find((d) => d.id === project.id);

    if (existingProject) {
      existingProject.title = project.title;
      existingProject.description = project.description;
    } else if (project.id !== undefined) {
      throw new Error("Project not found");
    } else {
      project.id = projects.length + 1;
      projects.push(project);
    }
    await this.saveProjects(projects);
  }

  async loadProjects(): Promise<Project[]> {
    if (!fs.existsSync(projectsPath)) {
      return [];
    }
    const projects = fs.readFileSync(projectsPath, "utf-8");
    return JSON.parse(projects).sort((a: Project, b: Project) => a.id - b.id);
  }

  async saveProjects(projects: Project[]): Promise<void> {
    fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2));
  }
}
