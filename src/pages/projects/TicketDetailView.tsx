import { LoaderFunction, useLoaderData } from "react-router-dom";
import { Button } from "../../components/Button";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { Ticket } from "../../models/ticket";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import TicketStatus from "./TicketStatus";

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
      <div className="flex">
        <div className="w-[calc(100%-240px)] h-[calc(100vh-56px)] overflow-auto max-h-full px-2 flex flex-col">
          <div className="border-b-[rgb(37,38,50)] border-b mb-4">
            <div className="text-2xl">{ticket.title}</div>
          </div>
          <p
            className="px-2 leading-7 flex-1"
            dangerouslySetInnerHTML={{ __html: ticket.description }}
          ></p>
          <div>
            <div className="text-2xl">Comments</div>
            <textarea
              className="w-full resize-none p-2 mt-2 bg-[rgb(32,33,46)] text-[rgb(228,229,244)] border border-[rgb(53,56,74)] rounded focus:outline-none focus:border-[rgb(53,56,74)]"
              placeholder="Leave a comment..."
              rows={3}
            ></textarea>

            <div className="my-2">
              <Button title="Add Comment" />
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="h-[calc(100vh-56px)] overflow-auto max-h-full bg-[rgb(32,33,46)] border-t border-t-[rgb(53,56,74)] border-r border-r-[rgb(53,56,74)] w-[240px] cursor-default">
          <div className="border-b border-b-[rgb(53,56,74)] px-4 h-14 flex items-center text-gray-400">
            {ticket.slug}
          </div>
          <div className="px-2 py-3 flex flex-col">
            <div className="flex items-center">
              <div className="min-w-20 h-8  px-2 text-gray-400 flex items-center ">
                Status
              </div>
              <div className=" h-8 pl-1 pr-2 text-[rgb(228,229,244)] flex items-center border border-transparent hover:bg-[rgba(82,82,121,0.25)] hover:border hover:border-[rgba(82,82,111,0.44)] rounded">
                <TicketStatus status={ticket.status} />
              </div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
                Assignee
              </div>
              <div className=" h-8 pl-1 pr-2 text-[rgb(228,229,244)] flex items-center border border-transparent hover:bg-[rgba(82,82,121,0.25)] hover:border hover:border-[rgba(82,82,111,0.44)] rounded">
                {ticket.assignee?.firstName ?? "unassigned"}
              </div>
            </div>
            <div className="flex">
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
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
              <div className="min-w-20 h-8 py-1 px-2 text-gray-400">
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
