import { useRef } from "react";
import { NavLink } from "react-router-dom";
import Dialog from "../components/common/Dialog";
import { useProjects } from "../hooks/projects/useProjects";
import "./Projects.css";
import ProjectCard from "../components/projects/ProjectCard";
import { Button } from "../components/Button";

export default function Projects() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { projects, isCreating, setIsCreating, createProject } = useProjects();

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }
  async function handleCreateProject() {
    const title = inputRef.current?.value;
    if (title) {
      await createProject(title);
    }
  }

  return (
    <div>
      {isCreating && (
        <>
          <Dialog
            title="Create Project"
            onClose={() => setIsCreating(false)}
            onSubmit={handleCreateProject}
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
      <Button onClick={openDialog} title="Create" />
      <div className="tb-card-wrapper">
        {projects.map((project: any) => (
          <ProjectCard project={project} />
        ))}
      </div>
    </div>
  );
}
