import { LoaderFunction, useLoaderData } from "react-router-dom";
import HeaderView from "../../components/HeaderView";
import { Breadcrumb } from "../../models/breadcrumb";
import { Page } from "../../models/page";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import PageService from "../../services/PageService";
import ProjectService from "../../services/ProjectService";
import { useEffect, useRef, useState } from "react";
import Button from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import DescriptionView from "../../components/projects/ticket-details/DescriptionView";
import PageStructureView from "./PageStructureView";

const pageService = PageService.shared;
const projectService = ProjectService.shared;

const PageDetailView: React.FC = () => {
  const data = useLoaderData() as {
    project: Project;
    page: Page;
    pages: Page[];
    openedPages: number[];
  };
  const { project } = data;

  const [page, setPage] = useState<Page>(data.page);

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Pages", link: ROUTES.PROJECTS_PAGES(project.slug) },
    { title: page.title, link: "" },
  ];

  // const currentIcon = useRef<HTMLInputElement>(null);
  const isOldVersion = false;
  const currentTitle = useRef<HTMLInputElement>(null);
  const currentContent = useRef(page.enrichedContent);
  const [isEditing, setIsEditing] = useState(false);

  // on url change
  useEffect(() => {
    currentContent.current = page.enrichedContent;
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

  // console.log(page);
  return (
    <div>
      <HeaderView breadcrumbs={breadcrumbs} />
      <div className="flex">
        <PageStructureView
          open={data.openedPages}
          pages={data.pages}
          projectSlug={project.slug}
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
                  <PencilSquareIcon className="size-5" />
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
  const page = await pageService.get(projectSlug, pageId);
  const pages = await pageService.getAllStructured(projectSlug);

  const project = await projectService.get(projectSlug);
  const openedPages = await pageService.getOpenedPages(projectSlug);
  // const metadata = await projectService.getMetadata(slug);
  return { project, page, pages, openedPages };
};
