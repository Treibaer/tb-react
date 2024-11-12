import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/projectService";
import { showToast } from "../../utils/tbToast";

export const ProjectCreationDialog: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState(
    ROUTES.TICKET_DETAILS("TL", "TL-1")
  );

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function handleCreateProject() {
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
        await ProjectService.shared.create(newProject);
        onClose();
        showToast("success", "", "Project created successfully");
      } catch (error: Error | any) {
        showToast("error", "", error.message);
      }
    } else {
      showToast("error", "", "Title is required");
    }
  }

  function onSlugChange() {
    let slug = slugRef.current?.value ?? "TL";
    if (slug === "") {
      slug = "TL";
    }
    slug = slug.toUpperCase().substring(0, 2);
    setPreviewUrl(ROUTES.TICKET_DETAILS(slug, `${slug}-1`));
  }

  return (
    <>
      <Dialog
        title="Create Project"
        onClose={onClose}
        onSubmit={handleCreateProject}
      >
        <input
          type="text"
          placeholder="Project title"
          className="tb-input"
          name="title"
          ref={inputRef}
        />
        <textarea
          placeholder="Description"
          className="tb-input"
          name="description"
          ref={descriptionRef}
        ></textarea>
        <input
          type="text"
          placeholder="Slug"
          className="tb-input"
          name="slug"
          onChange={onSlugChange}
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
