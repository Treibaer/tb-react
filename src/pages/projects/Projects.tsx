import { useRef } from "react";
import { Button } from "../../components/Button";
import Dialog from "../../components/common/Dialog";
import ProjectCard from "../../components/projects/ProjectCard";
import { useProjects } from "../../hooks/projects/useProjects";
import "./Projects.css";
import {
  PencilSquareIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";

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
      <div className="flex justify-start items-center gap-4">
        <div className="cursor-default">Projects</div>
        {/* <Button onClick={openDialog} title="Create" /> */}
        <button
          className="text-gray-400 rounded p-2 hover:bg-slate-700 "
          onClick={openDialog}
        >
          <PencilSquareIcon className="size-5" />
        </button>
      </div>
      <div className="tb-card-wrapper">
        {projects.map((project: any) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
