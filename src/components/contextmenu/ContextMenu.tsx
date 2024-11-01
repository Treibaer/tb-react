import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FaChartPie,
  FaChevronRight,
  FaSpinner,
  FaTag,
  FaTrash,
  FaUserCircle,
} from "react-icons/fa";
import useParty from "../../hooks/useParty";
import { DropdownType } from "../../models/dropdown-type";
import { ProjectMeta } from "../../models/project-meta";
import { TicketStatus } from "../../models/ticket-status";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import TicketService from "../../services/TicketService";
import { showToast } from "../../utils/tbToast";
import Confirmation from "../common/Confirmation";
import AssigneeDropdown from "../projects/ticket-details/dropdowns/AssigneeDropdown";
import BoardDropdown from "../projects/ticket-details/dropdowns/BoardDropdown";
import DropdownElement from "../projects/ticket-details/dropdowns/DropdownElement";
import PositionDropdown from "../projects/ticket-details/dropdowns/PositionDropdown";
import StatusDropdown from "../projects/ticket-details/dropdowns/StatusDropdown";
import TypeDropdown from "../projects/ticket-details/dropdowns/TypeDropdown";

const ticketService = TicketService.shared;

export const ContextMenu: React.FC<{
  metadata: ProjectMeta;
  config: TicketsContextMenuConfig;
  onClose: (update: boolean) => void;
}> = ({ metadata, config, onClose }) => {
  const { startParty } = useParty();
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);

  const ticket = config.ticket!;
  const project = metadata.project;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      onClose(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  async function onAssigneeChange(assigneeId: number | null) {
    if (assigneeId === null) {
      return;
    }
    if (assigneeId !== ticket.assignee?.id) {
      await ticketService.update(project.slug, ticket.slug, {
        assigneeId,
      });
      const assignee = metadata.users.find((u) => u.id === assigneeId);
      showToast("assignee", ticket.slug, assignee?.firstName, assignee?.avatar);
    }
    onClose(assigneeId !== ticket.assignee?.id);
  }

  async function onStatusChange(status: TicketStatus | null) {
    if (status === null) {
      return;
    }
    if (status !== ticket.status) {
      await ticketService.update(project.slug, ticket.slug, { status });
      // showToast(`${ticket.slug} updated`, `Status changed to ${status}`);
      showToast("state", ticket.slug, status);

      if (status === "done") {
        startParty();
      }
    }
    onClose(status !== ticket.status);
  }
  async function onBoardChange(boardId: number | null) {
    if (boardId === null) {
      return;
    }
    if (boardId !== ticket.board?.id) {
      await ticketService.update(project.slug, ticket.slug, { boardId });
      showToast(
        "board",
        ticket.slug,
        metadata.boards.find((b) => b.id === boardId)?.title
      );
    }
    onClose(boardId !== ticket.board?.id);
  }

  async function onTypeChange(type: string | null) {
    if (type === null) {
      return;
    }
    if (type !== ticket.type) {
      await ticketService.update(project.slug, ticket.slug, { type });
      showToast("type", ticket.slug, type);
    }
    onClose(type !== ticket.type);
  }

  async function onPositionChange(position: number | null) {
    if (position === null) {
      return;
    }
    if (position !== ticket.position) {
      await ticketService.update(project.slug, ticket.slug, {
        position,
      });
    }
    onClose(position !== ticket.position);
  }

  const [removingTicketSlug, setRemovingTicketSlug] = useState<string | null>(
    null
  );

  async function removeTicket() {
    if (removingTicketSlug) {
      await ticketService.remove(project.slug, removingTicketSlug);
      onClose(true);
      showToast("success", "", "Ticket deleted");
    }
  }

  return (
    <div ref={dropdownRef}>
      <AnimatePresence>
        {removingTicketSlug && (
          <Confirmation
            onCancel={() => setRemovingTicketSlug(null)}
            onConfirm={removeTicket}
          />
        )}
      </AnimatePresence>
      {dropdown === DropdownType.STATUS && (
        <StatusDropdown
          selectedStatus={ticket.status}
          states={metadata.states}
          onClick={onStatusChange}
          style={{ left: config.left + 146, top: config.top }}
        />
      )}
      {dropdown === DropdownType.ASSIGNEE && (
        <AssigneeDropdown
          selectedAssignee={ticket.assignee}
          users={metadata.users}
          onClick={onAssigneeChange}
          style={{ left: config.left + 146, top: config.top + 32 }}
        />
      )}
      {dropdown === DropdownType.BOARD && (
        <BoardDropdown
          selectedBoardId={ticket.board?.id ?? 0}
          boards={metadata.boards}
          onClose={onBoardChange}
          style={{ left: config.left + 146, top: config.top + 64 }}
        />
      )}
      {dropdown === DropdownType.TYPE && (
        <TypeDropdown
          selectedType={ticket.type}
          types={metadata.types}
          onClose={onTypeChange}
          style={{ left: config.left + 146, top: config.top + 96 }}
        />
      )}
      {config.board && dropdown === DropdownType.POSITION && (
        <PositionDropdown
          position={ticket.position}
          tickets={config.board.tickets}
          onClick={onPositionChange}
          style={{ left: config.left + 146, top: config.top + 128 }}
        />
      )}
      <div
        className={`ticket-details-dropdown tb-transparent-menu py-1 w-36`}
        style={{ left: config.left, top: config.top }}
      >
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.STATUS)}
        >
          <div className="flex gap-2">
            <FaSpinner className="size-4 text-gray-400 mt-1" />
            <div className="w-[60px]">Status</div>
            <FaChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.ASSIGNEE)}
        >
          <div className="flex gap-2">
            <FaUserCircle className="size-4 text-gray-400 mt-1" />
            <div className="w-[60px]">Assignee</div>
            <FaChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.BOARD)}
        >
          <div className="flex gap-2">
            <FaChartPie className="size-4 text-gray-400 mt-1" />
            <div className="w-[60px]">Board</div>
            <FaChevronRight className="h-5 w-5 text-gray-400" />
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.TYPE)}
        >
          <div className="flex gap-2">
            <FaTag className="size-4 text-gray-400 mt-1" />
            <div className="w-[60px]">Type</div>
            <FaChevronRight className="size-5 text-gray-400" />
          </div>
        </DropdownElement>
        {config.board && (
          <DropdownElement
            isSelected={false}
            onMouseOver={() => setDropdown(DropdownType.POSITION)}
          >
            <div className="flex gap-2">
              <FaTag className="size-4 text-gray-400 mt-1" />
              <div className="w-[60px]">Position</div>
              <FaChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          </DropdownElement>
        )}
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.NONE)}
          onClick={() => setRemovingTicketSlug(ticket.slug)}
        >
          <div className="flex gap-2">
            <FaTrash className="size-4 text-gray-400 mt-1" />
            <div>Delete</div>
          </div>
        </DropdownElement>
      </div>
    </div>
  );
};

export default ContextMenu;
