import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import Dialog from "../components/common/Dialog";
import ProjectService from "../services/ProjectService";
import "./Projects.css";
import { Project } from "../models/project";

const projectService = ProjectService.shared;

export default function Projects() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const projects = await projectService.loadProjects();
      setProjects(projects);
    }
    fetchData();
  }, []);

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function createProject() {
    const title = inputRef.current?.value;
    if (!title) {
      return;
    }
    // get two first chars of title
    const slug = title.toLowerCase().replace(/\s/g, "").substring(0, 2);
    const project: Project = {
      id: 0,
      slug: slug,
      description: "",
      title,
    };
    await projectService.createProject(project);
    const projects = await projectService.loadProjects();
    setProjects(projects);
    setIsCreating(false);
  }

  return (
    <div>
      {isCreating && (
        <>
          <Dialog
            title="Create Project"
            onClose={() => setIsCreating(false)}
            onSubmit={createProject}
          >
            <input
              type="text"
              placeholder="Project title"
              id="dialogTitle"
              className="tb-textarea"
              ref={inputRef}
            />
          </Dialog>
        </>
      )}
      <h1>Projects</h1>
      <button className="tb-button" onClick={openDialog}>
        Create
      </button>
      <div className="tb-card-wrapper">
        {projects.map((project: any) => (
          <NavLink
            to={`/projects/${project.slug}`}
            key={project.slug}
            className="tb-card"
          >
            <div className="icon">📒</div>
            <div className="title">{project.title}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
