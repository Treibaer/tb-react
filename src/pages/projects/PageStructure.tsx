import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Page } from "../../models/page";

const PageStructure: React.FC<{
  page: Page;
  projectSlug: string;
  openedPages: number[];
  openedPageId?: number;
  toggle: (id: number) => void;
}> = ({ page, projectSlug, openedPages, toggle, openedPageId }) => {
  const isOpened = openedPageId === page.id;
  return (
    <div key={page.id} className="">
      <div className="flex items-center gap-1">
        {page.children.length > 0 && (
          <div
            onClick={() => toggle(page.id)}
            className="hover:bg-hover p-1 cursor-pointer rounded"
          >
            {openedPages.includes(page.id) ? (
              <FaChevronDown className="size-4" />
            ) : (
              <FaChevronRight className="size-4" />
            )}
          </div>
        )}

        {page.children.length === 0 && <div className="w-4"></div>}
        <Link
          to={`/projects/${projectSlug}/pages/${page.id}`}
          className={`h-7 hover:bg-hover w-full items-center flex ${
            isOpened ? "bg-hover" : ""
          }`}
        >
          {page.icon} {page.title}
        </Link>
      </div>
      {page.children.length > 0 && openedPages.includes(page.id) && (
        <div className="ml-4">
          {page.children.map((child) => (
            <PageStructure
              key={child.id}
              openedPages={openedPages}
              projectSlug={projectSlug}
              page={child}
              toggle={toggle}
              openedPageId={openedPageId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageStructure;
