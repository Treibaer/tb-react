import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { LoaderFunction, NavLink, useLoaderData } from "react-router-dom";
import { ButtonIcon } from "../../components/ButtonIcon";
import Dialog from "../../components/common/Dialog";
import { Board } from "../../models/board-structure";
import ProjectService from "../../services/ProjectService";
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

      <div className="flex justify-start items-center gap-4 mb-4">
        <div className="cursor-default text-3xl font-semibold">Boards</div>
        {/* <Button onClick={openDialog} title="Create" /> */}
        <ButtonIcon onClick={openDialog}>
          <PencilSquareIcon className="size-5" />
        </ButtonIcon>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center gap-4 text-lg font-semibold">
          <div className="flex-1">Title</div>
          <div className="flex-1 text-center">Creator</div>
          <div className="flex-1 text-center">Tickets</div>
          <div className="flex-1 text-center">Start Date</div>
          <div className="flex-1 text-center">End Date</div>
        </div>
        {boards.map((board) => (
          <NavLink
            to={`/projects/${projectSlug}/boards/${board.id}`}
            key={board.id}
            style={{ display: "flex" }}
            className="flex justify-between items-center gap-4 border-b-gray-700 border-b h-12"
          >
            <div className="flex-1">{board.title}</div>
            <div className="flex-1 flex justify-center">
              <img
                className="h-7 w-7 rounded-full"
                src={board.creator.avatar}
                alt="avatar"
              />
            </div>
            <div className="flex-1 text-center">{board.tickets.length}</div>
            <div className="flex-1 text-center">
              {formatUnixTimestamp(board.startDate, FormatType.DAY)}
            </div>
            <div className="flex-1 text-center">
              {formatUnixTimestamp(board.endDate, FormatType.DAY)}
            </div>
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
  const boards = await projectService.getBoards(projectSlug);
  return { boards, projectSlug };
};
