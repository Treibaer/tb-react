import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { useProjects } from "../../hooks/projects/useProjects";
import { Project } from "../../models/project";
import ProjectService from "../../services/ProjectService";

export const ProjectCreationDialog: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { isCreating, setIsCreating, createProject } = useProjects();
  const [error, setError] = useState<string | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState("`/projects/TL/tickets/TL-1`");

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function handleCreateProject() {
    setError(undefined);

    const title = inputRef.current?.value;
    if (title) {
      try {
        const newProject: Project = {
          id: 0,
          slug: slugRef.current?.value ?? "",
          icon: "📒",
          description: "",
          title,
        };
        await ProjectService.shared.createProject(newProject);
        // await createProject(title);
        onClose();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  function onSlugChange() {
    let slug = slugRef.current?.value ?? "TL";
    if (slug === "") {
      slug = "TL";
    }
    slug = slug.toUpperCase().substring(0, 2);
    setPreviewUrl(`/projects/${slug}/tickets/${slug}-1`);
  }

  return (
    <>
      <Dialog
        error={error}
        title="Create Project"
        onClose={onClose}
        onSubmit={handleCreateProject}
      >
        <input
          type="text"
          placeholder="Project title"
          id="dialogTitle"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={inputRef}
        />
        <textarea
          placeholder="Description"
          id="dialogDescription"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={descriptionRef}
        ></textarea>
        <input
          type="text"
          placeholder="Slug"
          id="dialogSlug"
          className="tb-textarea"
          onChange={onSlugChange}
          style={{ boxShadow: "none", outline: "none" }}
          ref={slugRef}
        />
        <div>
          Hint: URLs in this project depend on the slug. Prevent changing it
        </div>
        <div>Example: {previewUrl}</div>
      </Dialog>
    </>
  );
};

export default ProjectCreationDialog;
