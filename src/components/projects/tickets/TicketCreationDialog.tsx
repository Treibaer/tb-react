import { useEffect, useRef, useState } from "react";
import { SmallBoard } from "../../../models/board-structure";
import { DropdownType } from "../../../models/dropdown-type";
import { ProjectMeta } from "../../../models/project-meta";
import { TicketStatus } from "../../../models/ticket-status";
import { User } from "../../../models/user";
import TicketService from "../../../services/TicketService";
import Dialog from "../../common/Dialog";
import TicketAssigneeField from "../ticket-details/TicketAssigneeField";
import TicketStatusView from "../ticket-details/TicketStatusView";
import AssigneeDropdown from "../ticket-details/dropdowns/AssigneeDropdown";
import BoardDropdown from "../ticket-details/dropdowns/BoardDropdown";
import StatusDropdown from "../ticket-details/dropdowns/StatusDropdown";
import TypeDropdown from "../ticket-details/dropdowns/TypeDropdown";

const ticketService = TicketService.shared;

export const TicketCreationDialog: React.FC<{
  metadata: ProjectMeta;
  onClose: (update: boolean) => void;
}> = ({ metadata, onClose }) => {
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);

  const project = metadata.project;

  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<SmallBoard | null>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function createTicket() {
    setError(undefined);
    const title = inputRef.current?.value;
    if (!title) {
      setError("Title is required");
      return;
    }
    const description = descriptionRef.current?.value ?? "";
    await ticketService.create(project.slug, {
      title,
      description,
      assigneeId: selectedAssignee?.id,
      status: selectedStatus,
      type: selectedType,
      boardId: selectedBoard?.id,
    });
    onClose(true);
  }

  async function updateStatus(status: TicketStatus | null) {
    setDropdown(DropdownType.NONE);
    if (status === null) {
      return;
    }
    setSelectedStatus(status);
  }

  async function updateAssignee(assigneeId: number | null) {
    setDropdown(DropdownType.NONE);
    if (assigneeId === null) {
      return;
    }
    setSelectedAssignee(
      metadata.users.find((u) => u.id === assigneeId) || null
    );
  }

  async function updateType(type: string | null) {
    setDropdown(DropdownType.NONE);
    if (type === null) {
      return;
    }
    setSelectedType(type);
  }

  async function updateBoard(boardId: number | null) {
    setDropdown(DropdownType.NONE);
    if (boardId === null) {
      return;
    }
    setSelectedBoard(metadata.boards.find((b) => b.id === boardId) || null);
  }

  return (
    <Dialog
      title={`${project.title} > Create ticket`}
      onClose={() => onClose(false)}
      onSubmit={createTicket}
      error={error}
    >
      <input
        type="text"
        placeholder="Title"
        id="dialogTitle"
        className="tb-textarea"
        style={{
          boxShadow: "none",
          outline: "none",
          marginLeft: "8px",
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
          marginLeft: "8px",
        }}
        ref={descriptionRef}
      ></textarea>

      <div className="flex items-center relative gap-2 mx-2 mt-2">
        {dropdown === DropdownType.STATUS && (
          <StatusDropdown
            selectedStatus={selectedStatus}
            states={metadata.states}
            onClick={updateStatus}
            style={{ left: 0, top: 34 }}
          />
        )}
        <div
          id="statusDropdown"
          className="select2-dropdown"
          onClick={() => setDropdown(DropdownType.STATUS)}
        >
          <TicketStatusView status={selectedStatus} />
        </div>
        {dropdown === DropdownType.ASSIGNEE && (
          <AssigneeDropdown
            selectedAssignee={selectedAssignee}
            users={metadata.users}
            onClick={updateAssignee}
            style={{ left: 82, top: 34 }}
          />
        )}
        <div
          id="assigneeDropdown"
          className="select2-dropdown"
          onClick={() => setDropdown(DropdownType.ASSIGNEE)}
        >
          <TicketAssigneeField user={selectedAssignee} />
        </div>
        {dropdown === DropdownType.BOARD && (
          <BoardDropdown
            selectedBoardId={selectedBoard?.id ?? 0}
            boards={metadata.boards}
            onClose={updateBoard}
            style={{ left: 216, top: 34 }}
          />
        )}
        <div
          id="boardDropdown"
          className="select2-dropdown overflow-x-hidden whitespace-nowrap w-32"
          title={selectedBoard?.title}
          onClick={() => setDropdown(DropdownType.BOARD)}
        >
          {selectedBoard?.title ?? "No board"}
        </div>
        {dropdown === DropdownType.TYPE && (
          <TypeDropdown
            selectedType={selectedType}
            types={metadata.types}
            onClose={updateType}
            style={{ left: 352, top: 34 }}
          />
        )}
        <div
          id="typeDropdown"
          className="select2-dropdown w-32"
          onClick={() => setDropdown(DropdownType.TYPE)}
        >
          {selectedType === "" ? "None" : selectedType}
        </div>
      </div>
    </Dialog>
  );
};

export default TicketCreationDialog;
