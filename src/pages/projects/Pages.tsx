import { Link, LoaderFunction, useLoaderData } from "react-router-dom";
import PageService from "../../services/PageService";
import { Page } from "../../models/page";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";
import PageStructure from "./PageStructure";
import { useState } from "react";

const pageService = PageService.shared;

const Pages: React.FC = () => {
  const data = useLoaderData() as {
    projectSlug: string;
    pages: Page[];
    openedPages: number[];
  };
  const [openedPages, setOpenedPages] = useState<number[]>(data.openedPages);

  async function toggle(id: number) {
    if (openedPages.includes(id)) {
      setOpenedPages(openedPages.filter((pageId) => pageId !== id));
    } else {
      setOpenedPages([...openedPages, id]);
    }
    pageService.togglePage(data.projectSlug, id);
  }

  return (
    <div>
      <h1>Pages</h1>
      <div className="flex">
        <div className="w-64">
          {data.pages
            .filter((page) => page.parentId === null)
            .map((page) => (
              <div key={page.id} className="ml-2">
                <PageStructure
                  openedPages={openedPages}
                  projectSlug={data.projectSlug}
                  page={page}
                  toggle={toggle}
                />
              </div>
            ))}
        </div>
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
                <Link to={`/projects/${data.projectSlug}/pages/${page.id}`}>
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
  const pages = await pageService.getAll(projectSlug);

  // iterate over the pages, check the parent of every page and add itlself to the children array of the parent
  pages.forEach((pageDTO) => {
    if (pageDTO.parentId) {
      const parent = pages.find((page) => page.id === pageDTO.parentId);
      if (parent) {
        parent.children.push(pageDTO);
      }
    }
  });
  // sort all children by position
  pages.forEach((page) => {
    page.children.sort((a, b) => a.position - b.position);
  });
  // sort pages
  pages.sort((a, b) => a.position - b.position);
  const openedPages = await pageService.getOpenedPages(projectSlug);
  // const metadata = await projectService.getMetadata(slug);
  return { pages, projectSlug, openedPages };
};
