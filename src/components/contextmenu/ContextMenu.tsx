import {
  ChartPieIcon,
  ChevronRightIcon,
  EllipsisHorizontalCircleIcon,
  TagIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";
import { DropdownType } from "../../models/dropdown-type";
import { Project } from "../../models/project";
import { ProjectMeta } from "../../models/project-meta";
import { Status } from "../../models/status";
import { TicketsContextMenuConfig } from "../../models/tickets-context-menu-config";
import ProjectService from "../../services/ProjectService";
import AssigneeDropdown from "../ticket-details/dropdowns/AssigneeDropdown";
import BoardDropdown from "../ticket-details/dropdowns/BoardDropdown";
import DropdownElement from "../ticket-details/dropdowns/DropdownElement";
import PositionDropdown from "../ticket-details/dropdowns/PositionDropdown";
import StatusDropdown from "../ticket-details/dropdowns/StatusDropdown";
import TypeDropdown from "../ticket-details/dropdowns/TypeDropdown";

const projectService = ProjectService.shared;

export const ContextMenu: React.FC<{
  metadata: ProjectMeta;
  config: TicketsContextMenuConfig;
  onClose: (update: boolean) => void;
}> = ({ metadata, config, onClose }) => {
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

  async function onAssigneeChange(userId: number | null) {
    if (userId === null) {
      return;
    }
    if (userId !== ticket.assignee?.id) {
      await projectService.updateAssignee(project.slug, ticket.slug, userId);
    }
    onClose(userId !== ticket.assignee?.id);
  }
  async function onStatusChange(status: Status | null) {
    if (status === null) {
      return;
    }
    if (status !== ticket.status) {
      await projectService.updateTicketStatus(
        project.slug,
        ticket.slug,
        status
      );
    }
    onClose(status !== ticket.status);
  }
  async function onBoardChange(boardId: number | null) {
    if (boardId === null) {
      return;
    }
    if (boardId !== ticket.board?.id) {
      await projectService.updateBoard(project.slug, ticket.slug, boardId);
    }
    onClose(boardId !== ticket.board?.id);
  }

  async function onTypeChange(type: string | null) {
    if (type === null) {
      return;
    }
    if (type !== ticket.type) {
      await projectService.updateType(project.slug, ticket.slug, type);
    }
    onClose(type !== ticket.type);
  }

  async function onPositionChange(position: number | null) {
    if (position === null) {
      return;
    }
    if (position !== ticket.position) {
      await projectService.updatePosition(project.slug, ticket.slug, position);
    }
    onClose(position !== ticket.position);
  }

  return (
    <div ref={dropdownRef}>
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
      </div>
    </div>
  );
};
