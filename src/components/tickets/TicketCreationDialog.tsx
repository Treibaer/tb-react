import Dialog from "../common/Dialog";
import { Project } from "../../models/project";
import { useEffect, useRef } from "react";
import { Ticket } from "../../models/ticket";
import ProjectService from "../../services/ProjectService";

const projectService = ProjectService.shared;

export const TicketCreationDialog: React.FC<{
  project: Project;
  onClose: (update: boolean) => void;
}> = ({ project, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  
  async function createTicket() {
    const title = inputRef.current?.value;
    if (!title) {
      return;
    }
    const newTicket: Ticket = {
      id: 0,
      position: 0,
      ticketId: 0,
      slug: "",
      title,
      description: descriptionRef.current?.value ?? "",
      type: "",
      createdAt: 0,
      updatedAt: 0,
      status: "open",
      board: null,
      creator: null,
      assignee: null,
    };
    await projectService.createTicket(project.slug, newTicket);
    onClose(true);
  }

  return (
    <Dialog
      title={`${project.title} > Create ticket`}
      onClose={() => onClose(false)}
      onSubmit={createTicket}
    >
      <input
        type="text"
        placeholder="Title"
        id="dialogTitle"
        className="tb-textarea"
        style={{
          boxShadow: "none",
          outline: "none",
        }}
        ref={inputRef}
      />
      <textarea
        placeholder="Description"
        id="dialogDescription"
        className="tb-textarea"
        style={{
          boxShadow: "none",
          outline: "none",
        }}
        ref={descriptionRef}
      ></textarea>
    </Dialog>
  );
};

export default TicketCreationDialog;
