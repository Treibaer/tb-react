import { useEffect, useRef } from "react";
import { Project } from "../../../models/project";
import TicketService from "../../../services/TicketService";
import Dialog from "../../common/Dialog";

const ticketService = TicketService.shared;

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
    await ticketService.create(project.slug, title, descriptionRef.current?.value ?? "");
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
