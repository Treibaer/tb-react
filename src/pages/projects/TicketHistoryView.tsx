import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import { TicketHistory } from "../../models/ticket-history";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import TicketService from "../../services/TicketService";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";

const projectService = ProjectService.shared;
const ticketService = TicketService.shared;

export default function TicketHistoryView() {
  const { project, ticket, history } = useLoaderData() as {
    project: Project;
    ticket: Ticket;
    history: TicketHistory[];
  };

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: ROUTES.TICKETS_BOARD_VIEW(project.slug) },
    {
      title: ticket.slug,
      link: ROUTES.TICKET_DETAILS(project.slug, ticket.slug),
    },
    { title: "History", link: "" },
  ];

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="text-3xl p-4">History</div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between font-semibold text-xl px-2">
          <div className="flex-1 text-center">Version</div>
          <div className="flex-1 text-center">Creator</div>
          <div className="flex-1 text-center">Created At</div>
        </div>
        {history.map((historyItem) => (
          <NavLink
            to={`${ROUTES.TICKET_DETAILS("HK", "HK-1")}?version=${
              historyItem.versionNumber
            }`}
            key={historyItem.createdAt}
            className="flex justify-between gap-4 border-b border-b-[rgb(37,38,50)] p-2 items-center bg:[rgb(25,26,35)] hover:bg-[rgb(28,29,42)]"
          >
            <div className="flex-1 text-center">
              #{historyItem.versionNumber}
            </div>
            {/* <div className="flex-1 text-center"> */}
            <div className="flex-1 justify-center flex items-center gap-2">
              <img
                src={historyItem.creator.avatar}
                className="h-6 w-6 rounded-full"
                alt=""
              />
              {historyItem.creator.firstName}
            </div>
            {/* </div> */}
            <div className="flex-1 text-center">
              {formatUnixTimestamp(historyItem.createdAt, FormatType.DAY_TIME)}
            </div>
          </NavLink>
        ))}
      </div>
    </>
  );
}

export const loader: LoaderFunction<{
  projectSlug: string;
  ticketSlug: string;
}> = async ({ params }) => {
  const projectSlug = params.projectSlug ?? "";
  const ticketSlug = params.ticketSlug ?? "";

  const project = await projectService.get(projectSlug);
  const ticket = await ticketService.get(projectSlug, ticketSlug);
  const history = await ticketService.getHistory(projectSlug, ticketSlug);

  return { project, ticket, history };
};
