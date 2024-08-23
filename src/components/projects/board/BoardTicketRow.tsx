import { NavLink } from "react-router-dom";
import { Ticket } from "../../../models/ticket";
import { ROUTES } from "../../../routes";
import TicketAssigneeField from "../../ticket-details/TicketAssigneeField";

export const BoardTicketRow: React.FC<{
  projectSlug: string;
  ticket: Ticket;
}> = ({ projectSlug, ticket }) => {
  return (
    <NavLink to={ROUTES.TICKET_DETAILS(projectSlug, ticket.slug)}>
      <div
        className="flex flex-col gap-1 p-3 rounded-lg"
        style={{
          border: "1px solid rgba(82, 82, 111, 0.44)",
          backgroundColor: "rgb(32, 33, 46)",
          boxShadow: "rgba(0, 0, 0, 0.2) 0px 4px 24px",
        }}
      >
        <div>{`${ticket.slug}: ${ticket.title}`}</div>
        <TicketAssigneeField user={ticket.assignee} />
      </div>
    </NavLink>
  );
};
export default BoardTicketRow;
