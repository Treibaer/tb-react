import {
  ChartPieIcon,
  ChevronRightIcon,
  EllipsisHorizontalCircleIcon,
  TagIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { DropdownType } from "../../models/dropdown-type";
import { ProjectMeta } from "../../models/project-meta";
import { TicketStatus } from "../../models/ticket-status";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import TicketService from "../../services/TicketService";
import { useToast } from "../../store/ToastContext";
import AssigneeDropdown from "../projects/ticket-details/dropdowns/AssigneeDropdown";
import BoardDropdown from "../projects/ticket-details/dropdowns/BoardDropdown";
import DropdownElement from "../projects/ticket-details/dropdowns/DropdownElement";
import PositionDropdown from "../projects/ticket-details/dropdowns/PositionDropdown";
import StatusDropdown from "../projects/ticket-details/dropdowns/StatusDropdown";
import TypeDropdown from "../projects/ticket-details/dropdowns/TypeDropdown";
import BlurredBackground from "../common/BlurredBackground";
import Confirmation from "../common/Confirmation";

const ticketService = TicketService.shared;

export const ContextMenu: React.FC<{
  metadata: ProjectMeta;
  config: TicketsContextMenuConfig;
  onClose: (update: boolean) => void;
}> = ({ metadata, config, onClose }) => {
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);

  const { showToast } = useToast();

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
      showToast(
        `${ticket.slug} updated`,
        `Assigned to ${
          metadata.users.find((u) => u.id === assigneeId)?.firstName
        }`
      );
    }
    onClose(assigneeId !== ticket.assignee?.id);
  }
  async function onStatusChange(status: TicketStatus | null) {
    if (status === null) {
      return;
    }
    if (status !== ticket.status) {
      await ticketService.update(project.slug, ticket.slug, { status });
      showToast(`${ticket.slug} updated`, `Status changed to ${status}`);
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
        `${ticket.slug} updated`,
        `Moved to ${
          metadata.boards.find((b) => b.id === boardId)?.title ?? "Backlog"
        }`
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
      showToast(`${ticket.slug} updated`, `Type changed to ${type}`);
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
    }
  }

  return (
    <div ref={dropdownRef}>
    {removingTicketSlug && (
      <BlurredBackground onClose={() => setRemovingTicketSlug(null)}>
        <Confirmation
          onCancel={() => setRemovingTicketSlug(null)}
          onConfirm={removeTicket}
        />
      </BlurredBackground>
    )}
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
          <div className="flex gap-1">
            <div className="">
              <EllipsisHorizontalCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="w-[70px]">Status</div>
            <div className="">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.ASSIGNEE)}
        >
          <div className="flex gap-1">
            <div className="">
              <UserCircleIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="w-[70px]">Assignee</div>
            <div className="">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.BOARD)}
        >
          <div className="flex gap-1">
            <div className="">
              <ChartPieIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="w-[70px]">Board</div>
            <div className="">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </DropdownElement>
        <DropdownElement
          isSelected={false}
          onMouseOver={() => setDropdown(DropdownType.TYPE)}
        >
          <div className="flex gap-1">
            <div className="">
              <TagIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="w-[70px]">Type</div>
            <div className="">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </DropdownElement>
        {config.board && (
          <DropdownElement
            isSelected={false}
            onMouseOver={() => setDropdown(DropdownType.POSITION)}
          >
            <div className="flex gap-1">
              <div className="">
                <TagIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="w-[70px]">Position</div>
              <div className="">
                <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </DropdownElement>
        )}
        <DropdownElement
          isSelected={false}
          onClick={() => setRemovingTicketSlug(ticket.slug)}
        >
          <div className="flex gap-1">
            <div className="">
              <TrashIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div>Delete</div>
          </div>
        </DropdownElement>
      </div>
    </div>
  );
};

export default ContextMenu;
