import { useEffect, useRef, useState } from "react";
import { FaPencil } from "react-icons/fa6";
import {
  LoaderFunction,
  useLoaderData
} from "react-router-dom";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import HeaderView from "../../components/HeaderView";
import DescriptionView from "../../components/projects/ticket-details/DescriptionView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Page } from "../../models/page";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import PageService from "../../services/PageService";
import ProjectService from "../../services/ProjectService";
import PageStructureView from "./PageStructureView";

const pageService = PageService.shared;
const projectService = ProjectService.shared;

const PageDetailView: React.FC = () => {
  const {
    page: initialPage,
    project,
    pages,
    openedPages,
  } = useLoaderData() as {
    project: Project;
    page: Page;
    pages: Page[];
    openedPages: number[];
  };

  const [page, setPage] = useState<Page>(initialPage);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Pages", link: ROUTES.PROJECTS_PAGES(project.slug) },
  ];

  // const currentIcon = useRef<HTMLInputElement>(null);
  const isOldVersion = false;
  const currentTitle = useRef<HTMLInputElement>(null);
  const currentContent = useRef(page.enrichedContent);
  const [isEditing, setIsEditing] = useState(false);
  const initialRender = useRef(true);

  // re-render on url change (loader data change)
  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }
    setPage(initialPage);
  }, [initialPage]);

  const parents = getParents(page, pages);
  for (const parent of parents) {
    breadcrumbs.push({
      title: parent.icon + " " + parent.title,
      link: ROUTES.PROJECTS_PAGE_DETAILS(project.slug, parent.id),
    });
    // open parent pages
    if (!openedPages.includes(parent.id)) {
      openedPages.push(parent.id);
      pageService.togglePage(project.slug, parent.id);
    }
  }
  // open itself: TODO: move to a state and combine with children
  if (!openedPages.includes(page.id)) {
    openedPages.push(page.id);
    pageService.togglePage(project.slug, page.id);
  }
  breadcrumbs.push({ title: page.icon + " " + page.title, link: "" });

  // get all parents of current page
  function getParents(page: Page, pages: Page[]): Page[] {
    const parents: Page[] = [];
    let parent = page;
    while (parent.parentId) {
      // eslint-disable-next-line no-loop-func
      parent = pages.find((p) => p.id === parent.parentId) as Page;
      if (!parent || parent.id === page.id) {
        break;
      }
      parents.push(parent);
    }
    return parents.reverse();
  }

  // on url change
  useEffect(() => {
    currentContent.current = page.enrichedContent;
    setPage(page);
  }, [page]);

  async function toggleEdit() {
    if (isOldVersion) {
      return;
    }
    if (isEditing) {
      const title = currentTitle.current?.value;
      const content = currentContent.current;
      const updatedPage = await pageService.update(project.slug, page.id, {
        title,
        content,
      });
      setPage(updatedPage);
    }
    setIsEditing((prev) => !prev);
  }
  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex">
        <PageStructureView
          open={openedPages}
          pages={pages}
          projectSlug={project.slug}
          openedPageId={page.id}
        />
        <div className="w-[calc(100%-16rem)]">
          <div className="flex h-12 items-center gap-2">
            {isEditing && (
              <input
                ref={currentTitle}
                type="text"
                className="w-full bg-transparent text-2xl"
                defaultValue={page.title}
              />
            )}
            {!isEditing && <div className="text-2xl">{page.title}</div>}
            <div>
              {isEditing && (
                <div className="flex gap-2">
                  <Button title="Save" onClick={toggleEdit} />
                  <Button
                    title="Cancel"
                    onClick={() => {
                      setIsEditing(false);
                      currentContent.current = page.content;
                    }}
                  />
                </div>
              )}
              {!isEditing && !isOldVersion && (
                <ButtonIcon onClick={toggleEdit}>
                  <FaPencil className="size-5" />
                </ButtonIcon>
              )}
            </div>
          </div>

          {!isEditing && (
            <p
              key={page.enrichedContent}
              className="px-2 leading-7 flex-1 rawDescription"
              dangerouslySetInnerHTML={{ __html: page.enrichedContent }}
            ></p>
          )}
          {isEditing && (
            <DescriptionView key={page.id} description={currentContent} />
          )}
        </div>
      </div>
    </div>
  );
};

export default PageDetailView;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const pageId = Number(params.pageId ?? "");

  const [project, page, pages, openedPages] = await Promise.all([
    projectService.get(projectSlug),
    pageService.get(projectSlug, pageId),
    pageService.getAllStructured(projectSlug),
    pageService.getOpenedPages(projectSlug),
  ]);
  return { project, page, pages, openedPages };
};
