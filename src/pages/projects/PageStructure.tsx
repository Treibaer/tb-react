import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Page } from "../../models/page";

const PageStructure: React.FC<{
  page: Page;
  projectSlug: string;
  openedPages: number[];
  toggle: (id: number) => void;
}> = ({ page, projectSlug, openedPages, toggle }) => {
  return (
    <div key={page.id} className="">
      <div className="flex items-center gap-1">
        {page.children.length > 0 && (
          <div
            onClick={() => toggle(page.id)}
            className="hover:bg-[rgb(81,74,110)] p-1 cursor-pointer rounded"
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
          className="h-7 hover:bg-[rgb(37,34,49)] w-full items-center flex"
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PageStructure;
