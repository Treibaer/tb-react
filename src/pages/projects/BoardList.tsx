import { useRef, useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Dialog from "../../components/common/Dialog";
import HeaderView from "../../components/HeaderView";
import { BoardHeaderView } from "../../components/projects/board-list/BoardHeaderView";
import { BoardRow } from "../../components/projects/board-list/BoardRow";
import TitleView from "../../components/TitleView";
import { Board } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import ProjectService from "../../services/ProjectService";
import { BoardService } from "../../services/BoardService";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

export const Boards: React.FC = () => {
  const { boards, project } = useLoaderData() as {
    boards: Board[];
    project: Project;
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function handleCreateBoard() {
    const title = inputRef.current?.value;
    if (title) {
      // await createProject(title);
    }
  }

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Boards", link: "" },
  ];

  return (
    <>
      {isCreating && (
        <Dialog
          title="Create Board"
          onClose={() => setIsCreating(false)}
          onSubmit={handleCreateBoard}
        >
          <input
            type="text"
            placeholder="Board title"
            id="dialogTitle"
            className="tb-textarea"
            ref={inputRef}
          />
        </Dialog>
      )}
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Boards" openDialog={openDialog} />
      <div className="flex flex-col">
        <BoardHeaderView />
        {boards.map((board) => (
          <BoardRow key={board.id} projectSlug={project.slug} board={board} />
        ))}
      </div>
    </>
  );
};

export default Boards;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";
  const project = await projectService.get(projectSlug);
  const boards = await boardService.getAll(projectSlug);
  return { boards, project };
};
