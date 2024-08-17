import { NavLink } from "react-router-dom";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";

export const BoardTicketRow: React.FC<{
  projectSlug: string;
  ticket: Ticket;
}> = ({ projectSlug, ticket }) => {
  return (
    <NavLink to={ROUTES.TICKET_DETAILS(projectSlug, ticket.slug)}>
      <div
        style={{
          border: "1px solid black",
          margin: "5px",
          padding: "4px",
          borderRadius: "10px",
        }}
      >
        <div>{`${ticket.slug}: ${ticket.title}`}</div>
        <div>
          <img
            className="avatar small"
            src={`${ticket.assignee?.avatar}`}
            alt={`${ticket.assignee?.firstName || "Assignee"}'s avatar`}
          />
          <div>{ticket.assignee?.firstName}</div>
        </div>
      </div>
    </NavLink>
  );
};
export default BoardTicketRow;
