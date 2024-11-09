import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import Dialog from "../../components/common/Dialog";
import HeaderView from "../../components/HeaderView";
import { BoardHeaderView } from "../../components/projects/board-list/BoardHeaderView";
import { BoardRow } from "../../components/projects/board-list/BoardRow";
import DnDWrapper from "../../components/projects/tickets/DndWrapper";
import TitleView from "../../components/TitleView";
import { Toggle } from "../../components/Toggle";
import { useSocket } from "../../hooks/useSocket";
import { Board } from "../../models/board-structure";
import { Breadcrumb } from "../../models/breadcrumb";
import { Project } from "../../models/project";
import { ROUTES } from "../../routes";
import { BoardService } from "../../services/BoardService";
import ProjectService from "../../services/ProjectService";
import { showToast } from "../../utils/tbToast";

const projectService = ProjectService.shared;
const boardService = BoardService.shared;

export const Boards: React.FC = () => {
  const { listenOn, listenOff, emit } = useSocket();

  const data = useLoaderData() as {
    boards: Board[];
    project: Project;
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editBoard, setEditBoard] = useState<Board | null>(null);
  const [boards, setBoards] = useState(data.boards);
  const [showAll, setShowAll] = useState(false);

  const project = data.project;

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);


  useEffect(() => {
    listenOn("matches", "update", (_) => {
      updateBoardList();
    });
    return () => {
      listenOff("matches", "update");
    };
  }, []);


  async function refresh() {
    await updateBoardList();
    emit("matches", "update", {});
  }

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
        refresh();
        showToast("success", "", "Board Created");
      } catch (error: Error | any) {
        showToast("error", "", error.message);
      }
    } else {
      showToast("error", "Title is required", "Please enter a title");
    }
  }

  async function handleUpdateBoard() {
    const title = editInputRef.current?.value;
    if (title && editBoard) {
      try {
        await boardService.update(project.slug, editBoard.id, { title });
        setEditBoard(null);
        refresh();
        showToast("success", editBoard.title, "Saved");
      } catch (error: Error | any) {
        showToast("error", "", error.message);
      }
    } else {
      showToast("error", "Title is required", "Please enter a title to update");
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

  const [dragIndex, setDragIndex] = useState(-1);
  const [hoverIndex, setHoverIndex] = useState(-1);

  async function moveBoard(dragIndex: number, hoverIndex: number) {
    if (dragIndex === hoverIndex) {
      return;
    }
    await boardService.moveBoard(project.slug, dragIndex, hoverIndex);
    refresh();
  }

  return (
    <>
      <AnimatePresence>
        {isCreating && (
          <Dialog
            title="Create Board"
            onClose={() => setIsCreating(false)}
            onSubmit={handleCreateBoard}
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
      <div className="flex justify-between items-center me-2">
        <TitleView title="Boards" openDialog={openDialog} />
        <Toggle
          title="Archived"
          defaultChecked={false}
          onChange={() => setShowAll(!showAll)}
        />
      </div>
      <div className="flex flex-col gap-1 p-2 bg-section">
        <BoardHeaderView />
        <DndProvider backend={HTML5Backend}>
          {boards
            .filter((board) => showAll || board.isActive)
            .map((board) => (
              <DnDWrapper
                key={board.id}
                dragIndex={dragIndex}
                setDragIndex={setDragIndex}
                hoverIndex={hoverIndex}
                setHoverIndex={setHoverIndex}
                id={board.id}
                moveTicket={moveBoard}
              >
                <BoardRow
                  key={board.id}
                  projectSlug={project.slug}
                  board={board}
                  update={refresh}
                  onEdit={toggleEdit}
                />
              </DnDWrapper>
            ))}
        </DndProvider>
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
