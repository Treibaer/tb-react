import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import PageService from "../../services/PageService";
import { Page } from "../../models/page";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import PageStructure from "./PageStructure";
import { useState } from "react";
import { Breadcrumb } from "../../models/breadcrumb";
import { ROUTES } from "../../routes";
import HeaderView from "../../components/HeaderView";
import ProjectService from "../../services/ProjectService";
import { Project } from "../../models/project";
import PageStructureView from "./PageStructureView";

const pageService = PageService.shared;
const projectService = ProjectService.shared;

const Pages: React.FC = () => {
  const data = useLoaderData() as {
    project: Project;
    pages: Page[];
    openedPages: number[];
  };
  const { project } = data;

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Pages", link: "" },
  ];
  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex">
        <PageStructureView open={data.openedPages} pages={data.pages} projectSlug={project.slug} />
        <div className="w-[calc(100%-16rem)]">
          <div className="flex border-b border-b-[rgb(37,38,50)] p-2 justify-start items-center bg-[rgb(32,33,46)]">
            <div className="flex-1">Title</div>
            <div className="flex-1">Created</div>
            <div className="flex-1">Updated</div>
          </div>
          {data.pages.map((page) => (
            <div
              key={page.id}
              className="flex border-b border-b-[rgb(37,38,50)] p-2 justify-start items-center hover:bg-[rgb(28,29,42)]"
            >
              <div className=" flex-1">
                <Link to={`/projects/${project.slug}/pages/${page.id}`}>
                  {page.title}
                </Link>
              </div>

              <div className="flex flex-1 items-center gap-2">
                <img
                  src={page.creator.avatar}
                  alt="avatar"
                  className="w-5 h-5 rounded-full"
                />
                <div>{formatUnixTimestamp(page.createdAt, FormatType.DAY)}</div>
              </div>
              <div className="flex flex-1 items-center gap-2">
                <img
                  src={page.updator.avatar}
                  alt="avatar"
                  className="w-5 h-5 rounded-full"
                />
                <div>{formatUnixTimestamp(page.updatedAt, FormatType.DAY)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pages;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const pages = await pageService.getAllStructured(projectSlug);

  const openedPages = await pageService.getOpenedPages(projectSlug);
  const project = await projectService.get(projectSlug);
  // const metadata = await projectService.getMetadata(slug);
  return { project, pages, openedPages };
};
