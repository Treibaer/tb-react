import { useEffect, useRef, useState } from "react";
import { SmallBoard } from "../../../models/board-structure";
import { DropdownType } from "../../../models/dropdown-type";
import { ProjectMeta } from "../../../models/project-meta";
import { Ticket } from "../../../models/ticket";
import { TicketStatus } from "../../../models/ticket-status";
import { User } from "../../../models/user";
import { useToast } from "../../../pages/store/ToastContext";
import TicketService from "../../../services/TicketService";
import { Toggle } from "../../Toggle";
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
  initialBoardId?: number;
  onClose: (update: boolean) => void;
}> = ({ metadata, onClose, initialBoardId }) => {
  const [error, setError] = useState<string | undefined>();
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);

  const project = metadata.project;

  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<SmallBoard | null>(
    metadata.boards.find((b) => b.id === initialBoardId) || null
  );

  const [stayOpen, setStayOpen] = useState(false);

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
    const ticket = await ticketService.create(project.slug, {
      title,
      description,
      assigneeId: selectedAssignee?.id,
      status: selectedStatus,
      type: selectedType,
      boardId: selectedBoard?.id,
    });
    handleCreateTicket(ticket);

    if (!stayOpen) {
      onClose(true);
    } else {
      inputRef.current!.value = "";
      descriptionRef.current!.value = "";
      setSelectedAssignee(null);
      setSelectedStatus("open");
      setSelectedType("");
      setSelectedBoard(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
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

  function toggleStayOpen() {
    setStayOpen(!stayOpen);
  }

  const { showToast } = useToast();

  const handleCreateTicket = (ticket: Ticket) => {
    showToast("Ticket Created", "Ticket ID: " + ticket.ticketId);
  };

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
        className="tb-input"
        ref={inputRef}
      />
      <textarea
        placeholder="Description"
        className="tb-input h-32"
        ref={descriptionRef}
      ></textarea>

      <div className="flex items-center sm:flex-row gap-2 mx-2 mt-2 mb-8">
        <div className="flex flex-col sm:flex-row">
          <div className="relative">
            {dropdown === DropdownType.STATUS && (
              <StatusDropdown
                selectedStatus={selectedStatus}
                states={metadata.states}
                onClick={updateStatus}
                style={{ left: -2, top: 34 }}
              />
            )}
            <div
              id="statusDropdown"
              className="select2-dropdown relative"
              onClick={() => setDropdown(DropdownType.STATUS)}
            >
              <TicketStatusView status={selectedStatus} />
            </div>
          </div>
          <div className="relative">
            {dropdown === DropdownType.ASSIGNEE && (
              <AssigneeDropdown
                selectedAssignee={selectedAssignee}
                users={metadata.users}
                onClick={updateAssignee}
                style={{ left: -2, top: 34 }}
              />
            )}
            <div
              id="assigneeDropdown"
              className="select2-dropdown  w-32"
              onClick={() => setDropdown(DropdownType.ASSIGNEE)}
            >
              <TicketAssigneeField user={selectedAssignee} />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row">
          <div className="relative">
            {dropdown === DropdownType.BOARD && (
              <BoardDropdown
                selectedBoardId={selectedBoard?.id ?? 0}
                boards={metadata.boards}
                onClose={updateBoard}
                style={{ left: -4, top: 34 }}
              />
            )}
            <div
              id="boardDropdown"
              className="select2-dropdown"
              title={selectedBoard?.title}
              onClick={() => setDropdown(DropdownType.BOARD)}
            >
              <div className=" overflow-x-hidden whitespace-nowrap w-32">
                {selectedBoard?.title ?? "No board"}
              </div>
            </div>
          </div>
          <div className="relative">
            {dropdown === DropdownType.TYPE && (
              <TypeDropdown
                selectedType={selectedType}
                types={metadata.types}
                onClose={updateType}
                style={{ left: -4, top: 34 }}
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
        </div>
        <Toggle title="" defaultChecked={false} onChange={toggleStayOpen} />
      </div>
    </Dialog>
  );
};

export default TicketCreationDialog;
