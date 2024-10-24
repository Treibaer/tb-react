import { useEffect, useRef, useState } from "react";
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
import { BoardService } from "../../services/BoardService";
import ProjectService from "../../services/ProjectService";
import { AnimatePresence } from "framer-motion";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

export const Boards: React.FC = () => {
  const data = useLoaderData() as {
    boards: Board[];
    project: Project;
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editBoard, setEditBoard] = useState<Board | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);
  const [boards, setBoards] = useState(data.boards);

  const project = data.project;

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function updateBoardList() {
    const updatedBoards = await boardService.getAll(data.project.slug);
    setBoards(updatedBoards);
  }

  function openDialog() {
    setIsCreating(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }

  async function handleCreateBoard() {
    const title = inputRef.current?.value;
    if (title) {
      try {
        const newBoard: Board = {
          id: 0,
          title,
          tickets: [],
          position: boards.length, // gets overridden by the server
          isActive: true,
        };
        await BoardService.shared.create(project.slug, newBoard);
        setIsCreating(false);
        updateBoardList();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  async function handleUpdateBoard() {
    const title = editInputRef.current?.value;
    if (title && editBoard) {
      try {
        await boardService.update(project.slug, editBoard.id, { title });
        setEditBoard(null);
        updateBoardList();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  function toggleEdit(board: Board) {
    setEditBoard(board);
    setTimeout(() => {
      editInputRef.current?.focus();
    }, 100);
  }

  const breadcrumbs: Breadcrumb[] = [
    { title: "Home", link: ROUTES.HOME },
    { title: "Projects", link: ROUTES.PROJECTS },
    { title: project.title, link: ROUTES.PROJECT_DETAILS(project.slug) },
    { title: "Boards", link: "" },
  ];

  return (
    <>
      <AnimatePresence>
        {isCreating && (
          <Dialog
            title="Create Board"
            onClose={() => setIsCreating(false)}
            onSubmit={handleCreateBoard}
            error={error}
          >
            <input
              type="text"
              placeholder="Board title"
              className="tb-input mb-10"
              ref={inputRef}
            />
          </Dialog>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {editBoard && (
          <Dialog
            title="Update Board"
            submitTitle="Update"
            onClose={() => setEditBoard(null)}
            onSubmit={handleUpdateBoard}
            error={error}
          >
            <input
              type="text"
              placeholder="Board title"
              className="tb-input mb-10"
              defaultValue={editBoard?.title}
              ref={editInputRef}
            />
          </Dialog>
        )}
      </AnimatePresence>
      <HeaderView breadcrumbs={breadcrumbs} />
      <TitleView title="Boards" openDialog={openDialog} />
      <div className="flex flex-col">
        <BoardHeaderView />
        {boards.map((board) => (
          <BoardRow
            key={board.id}
            projectSlug={project.slug}
            board={board}
            update={updateBoardList}
            onEdit={toggleEdit}
          />
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
