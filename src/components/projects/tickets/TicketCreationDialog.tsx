import { useEffect, useRef, useState } from "react";
import { SmallBoard } from "../../../models/board-structure";
import { DropdownType } from "../../../models/dropdown-type";
import { ProjectMeta } from "../../../models/project-meta";
import { TicketStatus } from "../../../models/ticket-status";
import { User } from "../../../models/user";
import TicketService from "../../../services/TicketService";
import { showToast } from "../../../utils/tbToast";
import { Toggle } from "../../Toggle";
import Dialog from "../../common/Dialog";
import TicketAssigneeField from "../ticket-details/TicketAssigneeField";
import TicketStatusView from "../ticket-details/TicketStatusView";
import AssigneeDropdown from "../ticket-details/dropdowns/AssigneeDropdown";
import BoardDropdown from "../ticket-details/dropdowns/BoardDropdown";
import StatusDropdown from "../ticket-details/dropdowns/StatusDropdown";
import TypeDropdown from "../ticket-details/dropdowns/TypeDropdown";
import { AnimatePresence } from "framer-motion";

const ticketService = TicketService.shared;

export const TicketCreationDialog: React.FC<{
  metadata: ProjectMeta;
  initialBoardId?: number;
  parentId?: number;
  onClose: (update: boolean) => void;
  updateBoardView: () => void;
}> = ({ metadata, onClose, initialBoardId, updateBoardView, parentId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLInputElement>(null);
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);

  const project = metadata.project;

  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus>("open");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedBoard, setSelectedBoard] = useState<SmallBoard | null>(
    metadata.boards.find((b) => b.id === initialBoardId) || null
  );

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLDivElement> | KeyboardEvent
  ) {
    const { key } = event; // Destructure key from event for easier access
    const isInputFocused = document.activeElement === inputRef.current;
    const isDescriptionFocused =
      document.activeElement === descriptionRef.current;

    // Handle focus transitions for inputs
    if (key === "ArrowDown" && isInputFocused) {
      descriptionRef.current?.focus();
    } else if (
      key === "ArrowUp" &&
      isDescriptionFocused &&
      !descriptionRef.current?.value
    ) {
      inputRef.current?.focus();
    } else if (key === "Escape") {
      dropdown !== DropdownType.NONE
        ? setDropdown(DropdownType.NONE)
        : onClose(false);
    } else if (key === "Enter" && !isDescriptionFocused) {
      createTicket();
      setDropdown(DropdownType.NONE);
    }

    // open dropdowns when no input is focus
    if (isInputFocused || isDescriptionFocused) {
      return;
    }
    if (event.key === "s") {
      setDropdown(DropdownType.STATUS);
    }
    if (event.key === "a") {
      setDropdown(DropdownType.ASSIGNEE);
    }
    if (event.key === "t") {
      setDropdown(DropdownType.TYPE);
    }
    if (event.key === "b") {
      setDropdown(DropdownType.BOARD);
    }
    if (event.key === "w") {
      toggleStayOpen();
      toggleRef.current!.checked = !toggleRef.current?.checked;
    }
    if (dropdown === DropdownType.STATUS) {
      console.log("Key pressedf", event.key);
      if (event.key === "1") {
        updateStatus("open");
      }
      if (event.key === "2") {
        updateStatus("inProgress");
      }
      if (event.key === "3") {
        updateStatus("done");
      }
    }
    if (dropdown === DropdownType.ASSIGNEE) {
      if (event.key === "1") {
        updateAssignee(0);
      }
      if (event.key === "2") {
        updateAssignee(metadata.users[0].id);
      }
      if (event.key === "3") {
        updateAssignee(metadata.users[1].id);
      }
    }
    if (dropdown === DropdownType.BOARD) {
      if (event.key === "1") {
        updateBoard(0);
      }
      if (event.key === "2") {
        updateBoard(metadata.boards[0].id);
      }
      if (event.key === "3") {
        updateBoard(metadata.boards[1].id);
      }
      if (event.key === "4") {
        updateBoard(metadata.boards[2].id);
      }
      if (event.key === "5") {
        updateBoard(metadata.boards[3].id);
      }
      if (event.key === "6") {
        updateBoard(metadata.boards[4].id);
      }
      if (event.key === "7") {
        updateBoard(metadata.boards[5].id);
      }
      if (event.key === "8") {
        updateBoard(metadata.boards[6].id);
      }
    }
  }

  useEffect(() => {
    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdown]);

  const [stayOpen, setStayOpen] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function createTicket() {
    const title = inputRef.current?.value;
    if (!title) {
      showToast("error", "", "Title is required");
      return;
    }
    const description = descriptionRef.current?.value ?? "";
    try {
      const ticket = await ticketService.create(project.slug, {
        title,
        description,
        assigneeId: selectedAssignee?.id,
        status: selectedStatus,
        type: selectedType,
        boardId: selectedBoard?.id,
        parentId,
      });
      showToast("success", "", `Ticket ${ticket.slug} Created`);
    } catch (err: any) {
      showToast("error", "", err.message);
      return;
    }

    if (!stayOpen) {
      onClose(true);
    } else {
      inputRef.current!.value = "";
      descriptionRef.current!.value = "";
      setSelectedAssignee(null);
      setSelectedStatus("open");
      setSelectedType("");
      // setSelectedBoard(null);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      updateBoardView();
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
    setStayOpen((prev) => !prev);
  }

  function toggleDropdown(type: DropdownType) {
    setDropdown(dropdown === type ? DropdownType.NONE : type);
  }
  return (
    <Dialog
      title={`${project.title} > Create ${parentId ? "subtask" : "ticket"}`}
      onClose={() => onClose(false)}
      onSubmit={createTicket}
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
            <AnimatePresence>
              {dropdown === DropdownType.STATUS && (
                <StatusDropdown
                  selectedStatus={selectedStatus}
                  states={metadata.states}
                  onClick={updateStatus}
                  style={{ left: -2, top: 34, minWidth: 150 }}
                  showNumbers
                />
              )}
            </AnimatePresence>
            <div
              id="statusDropdown"
              className="select2-dropdown relative"
              onClick={() => toggleDropdown(DropdownType.STATUS)}
            >
              <TicketStatusView status={selectedStatus} />
            </div>
          </div>
          <div className="relative">
            <AnimatePresence>
              {dropdown === DropdownType.ASSIGNEE && (
                <AssigneeDropdown
                  selectedAssignee={selectedAssignee}
                  users={metadata.users}
                  onClick={updateAssignee}
                  style={{ left: -2, top: 34, minWidth: 160 }}
                  showNumbers
                />
              )}
            </AnimatePresence>
            <div
              id="assigneeDropdown"
              className="select2-dropdown w-32"
              onClick={() => toggleDropdown(DropdownType.ASSIGNEE)}
            >
              <TicketAssigneeField user={selectedAssignee} />
            </div>
          </div>
        </div>

        {parentId === null && (
          <div className="flex flex-col sm:flex-row">
            <div className="relative">
              <AnimatePresence>
                {dropdown === DropdownType.BOARD && (
                  <BoardDropdown
                    selectedBoardId={selectedBoard?.id ?? 0}
                    boards={metadata.boards}
                    onClose={updateBoard}
                    style={{ left: -4, top: 34, minWidth: 160 }}
                    showNumbers
                  />
                )}
              </AnimatePresence>
              <div
                id="boardDropdown"
                className="select2-dropdown"
                title={selectedBoard?.title}
                onClick={() => toggleDropdown(DropdownType.BOARD)}
              >
                <div className=" overflow-x-hidden whitespace-nowrap w-32">
                  {selectedBoard?.title ?? "No board"}
                </div>
              </div>
            </div>
            <div className="relative">
              <AnimatePresence>
                {dropdown === DropdownType.TYPE && (
                  <TypeDropdown
                    selectedType={selectedType}
                    types={metadata.types}
                    onClose={updateType}
                    style={{ left: -4, top: 34 }}
                  />
                )}
              </AnimatePresence>
              <div
                id="typeDropdown"
                className="select2-dropdown w-32"
                onClick={() => toggleDropdown(DropdownType.TYPE)}
              >
                {selectedType === "" ? "None" : selectedType}
              </div>
            </div>
          </div>
        )}
        <Toggle
          title=""
          defaultChecked={false}
          onChange={toggleStayOpen}
          ref={toggleRef}
        />
      </div>
    </Dialog>
  );
};

export default TicketCreationDialog;
