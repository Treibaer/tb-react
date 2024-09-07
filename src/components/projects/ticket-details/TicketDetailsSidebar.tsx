import { useEffect, useState } from "react";
import { DropdownType } from "../../../models/dropdown-type";
import { ProjectMeta } from "../../../models/project-meta";
import { Ticket } from "../../../models/ticket";
import { TicketStatus } from "../../../models/ticket-status";
import TicketService from "../../../services/TicketService";
import { FormatType, formatUnixTimestamp } from "../../../utils/dataUtils";
import TicketAssigneeField from "./TicketAssigneeField";
import TicketDetailsRow from "./TicketDetailsRow";
import TicketStatusView from "./TicketStatusView";
import AssigneeDropdown from "./dropdowns/AssigneeDropdown";
import BoardDropdown from "./dropdowns/BoardDropdown";
import StatusDropdown from "./dropdowns/StatusDropdown";
import TypeDropdown from "./dropdowns/TypeDropdown";
import { NavLink } from "react-router-dom";
import { TicketHistory } from "../../../models/ticket-history";

const ticketService = TicketService.shared;

export const TicketDetailsSidebar: React.FC<{
  metadata: ProjectMeta;
  ticket: Ticket;
  update: (ticket: Ticket) => void;
}> = ({ ticket, update, metadata }) => {
  const [dropdown, setDropdown] = useState<DropdownType>(DropdownType.NONE);
  const project = metadata.project;
  const [history, setHistory] = useState<TicketHistory[]>([]);

  async function updateStatus(status: TicketStatus | null) {
    setDropdown(DropdownType.NONE);
    if (status === null || ticket.status === status) {
      return;
    }
    const updatedTicket = await ticketService.update(
      project.slug,
      ticket.slug,
      { status }
    );
    update(updatedTicket);
  }

  async function updateAssignee(assigneeId: number | null) {
    setDropdown(DropdownType.NONE);
    if (assigneeId === null) {
      return;
    }
    const updatedTicket = await ticketService.update(
      project.slug,
      ticket.slug,
      { assigneeId }
    );
    update(updatedTicket);
  }

  async function updateType(type: string | null) {
    setDropdown(DropdownType.NONE);
    if (type === null) {
      return;
    }
    const updatedTicket = await ticketService.update(
      project.slug,
      ticket.slug,
      { type }
    );
    update(updatedTicket);
  }

  async function updateBoard(boardId: number | null) {
    setDropdown(DropdownType.NONE);
    if (boardId === null) {
      return;
    }
    const updatedTicket = await ticketService.update(
      project.slug,
      ticket.slug,
      { boardId }
    );
    update(updatedTicket);
  }

  useEffect(() => {
    async function loadHistory() {
      const history = await ticketService.getHistory(project.slug, ticket.slug);
      setHistory(history);
    }
    loadHistory();
  }, [project, ticket]);

  return (
    <div className="h-[calc(100vh-56px)] overflow-auto max-h-full bg-[rgb(32,33,46)] border-t border-t-[rgb(53,56,74)] border-r border-r-[rgb(53,56,74)] w-[254px] cursor-default">
      <div className="border-b border-b-[rgb(53,56,74)] px-4 h-14 flex items-center text-gray-400">
        {ticket.slug}
      </div>
      <div className="px-2 py-3 flex flex-col">
        <div className="flex items-center relative">
          <div>
            {dropdown === DropdownType.STATUS && (
              <StatusDropdown
                selectedStatus={ticket.status}
                states={metadata.states}
                onClick={updateStatus}
                style={{ left: 80, top: 34 }}
              />
            )}
          </div>
          <div className="min-w-20 h-8 px-2 text-gray-400 flex items-center ">
            Status
          </div>
          <div
            id="statusDropdown"
            className="select2-dropdown"
            onClick={() => setDropdown(DropdownType.STATUS)}
          >
            <TicketStatusView status={ticket.status} />
          </div>
        </div>
        <div className="flex items-center relative">
          {dropdown === DropdownType.ASSIGNEE && (
            <AssigneeDropdown
              selectedAssignee={ticket.assignee}
              users={metadata.users}
              onClick={updateAssignee}
              style={{ left: 80, top: 34 }}
            />
          )}
          <div className="min-w-20 h-8 py-1 px-2 text-gray-400">Assignee</div>
          <div
            id="assigneeDropdown"
            className="select2-dropdown"
            onClick={() => setDropdown(DropdownType.ASSIGNEE)}
          >
            <TicketAssigneeField user={ticket.assignee} />
          </div>
        </div>
        <div className="flex items-center relative">
          {dropdown === DropdownType.BOARD && (
            <BoardDropdown
              selectedBoardId={ticket.board?.id ?? 0}
              boards={metadata.boards}
              onClose={updateBoard}
              style={{ left: 0, top: 34 }}
            />
          )}
          <div className="min-w-20 h-8 py-1 px-2 text-gray-400">Board</div>
          <div
            id="boardDropdown"
            className="select2-dropdown overflow-x-hidden whitespace-nowrap"
            title={ticket.board?.title}
            onClick={() => setDropdown(DropdownType.BOARD)}
          >
            {ticket.board?.title}
          </div>
        </div>
        <div className="flex items-center relative">
          {dropdown === DropdownType.TYPE && (
            <TypeDropdown
              selectedType={ticket.type}
              types={metadata.types}
              onClose={updateType}
              style={{ left: 80, top: 34 }}
            />
          )}
          <div className="min-w-20 h-8 py-1 px-2 text-gray-400">Type</div>
          <div
            id="typeDropdown"
            className="select2-dropdown"
            onClick={() => setDropdown(DropdownType.TYPE)}
          >
            {ticket.type}
          </div>
        </div>
        <hr className="my-4" />
        <TicketDetailsRow title="Creator">
          <TicketAssigneeField user={ticket.creator} />
        </TicketDetailsRow>
        <TicketDetailsRow title="Created">
          <div
            title={formatUnixTimestamp(ticket.createdAt, FormatType.DAY_TIME)}
          >
            {formatUnixTimestamp(ticket.createdAt, FormatType.DAY)}
          </div>
        </TicketDetailsRow>
        <TicketDetailsRow title="Changed">
          <div
            title={formatUnixTimestamp(ticket.updatedAt, FormatType.DAY_TIME)}
          >
            {formatUnixTimestamp(ticket.createdAt, FormatType.DAY)}
          </div>
        </TicketDetailsRow>
        <TicketDetailsRow title="History">
          <NavLink to={`history`}>
            {history.length} Version{history.length !== 1 ? "s" : undefined}
          </NavLink>
        </TicketDetailsRow>
      </div>
    </div>
  );
};

export default TicketDetailsSidebar;
