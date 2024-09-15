import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
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
            className="hover:bg-mediumBlue3 p-1 cursor-pointer rounded"
          >
            {openedPages.includes(page.id) ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronRightIcon className="h-4 w-4" />
            )}
          </div>
        )}

        {page.children.length === 0 && <div className="w-4"></div>}
        <Link
          to={`/projects/${projectSlug}/pages/${page.id}`}
          className={`h-7 hover:bg-mediumBlue3 w-full items-center flex ${
            isOpened ? "bg-mediumBlue3" : ""
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
