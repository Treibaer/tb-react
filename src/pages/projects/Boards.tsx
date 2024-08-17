import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import ProjectService from "../../services/ProjectService";
import { Board } from "../../models/board-structure";
import { Button } from "../../components/Button";
import { useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";

const projectService = ProjectService.shared;

export const Boards: React.FC = () => {
  const { boards, projectSlug } = useLoaderData() as {
    boards: Board[];
    projectSlug: string;
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

  return (
    <div>
      {isCreating && (
        <>
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
        </>
      )}
      <h1>Boards</h1>
      <Button onClick={openDialog} title="Create" />
      <div>
        {boards.map((board) => (
          <NavLink
            to={`/projects/${projectSlug}/boards/${board.id}`}
            key={board.id}
            style={{ display: "flex" }}
          >
            <div>{board.title}</div>
            <div>{board.creator.avatar}</div>
            <div>{board.tickets.length}</div>
            <div>{formatUnixTimestamp(board.startDate, FormatType.DAY)}</div>
            <div>{formatUnixTimestamp(board.endDate, FormatType.DAY)}</div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Boards;

export const loader: LoaderFunction<{ projectSlug: string }> = async ({
  params,
}) => {
  const projectSlug = params.projectSlug ?? "";

  // const project = await projectService.loadProjectBySlug(slug);
  const boards = await projectService.loadBoards(projectSlug);
  return { boards, projectSlug };
};
