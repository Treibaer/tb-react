import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Ticket } from "../../models/ticket";
import ProjectService from "../../services/ProjectService";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import HeaderView from "../../components/HeaderView";
import { Project } from "../../models/project";

const projectService = ProjectService.shared;

export default function TicketDetailView() {
  const { ticket, project } = useLoaderData() as {
    ticket: Ticket;
    project: Project;
  };

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Tickets", link: ROUTES.TICKETS_BOARD_VIEW(project.slug) },
    { title: ticket.slug, link: "" },
  ];

  return (
    <>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex mx-4">
        <div className="flex-1">
          <div className="text-2xl font-semibold">{ticket.title}</div>
          <p
            className="text-base"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          ></p>
        </div>
        <div className="bg-slate-800 border-t border-t-slate-900 border-r border-r-slate-900 w-[240px] cursor-default">
          <div className="border-b border-b-slate-600 px-4 h-12 flex items-center text-slate-300">
            {ticket.slug}
          </div>
          <div className="px-2 py-3 flex flex-col">
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400 font-semibold">
                Status
              </div>
              <div className="min-w-20 h-8 py-1 px-2 text-white">Done</div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400 font-semibold">
                Assignee
              </div>
              <div className="min-w-20 h-8 py-1 px-2 text-white">Hannes</div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400 font-semibold">
                Created
              </div>
              <div
                className="min-w-20 h-8 py-1 px-2 text-white"
                title={formatUnixTimestamp(
                  ticket.createdAt,
                  FormatType.DAY_TIME
                )}
              >
                {formatUnixTimestamp(ticket.createdAt, FormatType.DAY)}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400 font-semibold">
                Changed
              </div>
              <div
                className="min-w-20 h-8 py-1 px-2 text-white"
                title={formatUnixTimestamp(
                  ticket.updatedAt,
                  FormatType.DAY_TIME
                )}
              >
                {formatUnixTimestamp(ticket.updatedAt, FormatType.DAY)}
              </div>
            </div>
            <hr />
          </div>
        </div>
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

  const project = await projectService.getProject(projectSlug);
  const ticket = await projectService.getTicket(projectSlug, ticketSlug);

  return { project, ticket };
};
