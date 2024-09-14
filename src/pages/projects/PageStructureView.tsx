import { useState } from "react";
import { Page } from "../../models/page";
import PageService from "../../services/PageService";
import PageStructure from "./PageStructure";

const pageService = PageService.shared;

const PageStructureView: React.FC<{
  projectSlug: string;
  pages: Page[];
  open: number[];
  openedPageId?: number;
}> = ({ projectSlug, pages, open, openedPageId }) => {
  const [openedPages, setOpenedPages] = useState<number[]>(open);

  async function toggle(id: number) {
    if (openedPages.includes(id)) {
      setOpenedPages(openedPages.filter((pageId) => pageId !== id));
    } else {
      setOpenedPages([...openedPages, id]);
    }
    pageService.togglePage(projectSlug, id);
  }

  return (
    <div className="w-64">
      {pages
        .filter((page) => page.parentId === null)
        .map((page) => (
          <div key={page.id} className="ml-2">
            <PageStructure
              openedPages={openedPages}
              projectSlug={projectSlug}
              page={page}
              toggle={toggle}
              openedPageId={openedPageId}
            />
          </div>
        ))}
    </div>
  );
};

export default PageStructureView;
