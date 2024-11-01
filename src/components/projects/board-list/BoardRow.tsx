import { FaArchive, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { Board } from "../../../models/board-structure";
import { ROUTES } from "../../../routes";
import { BoardService } from "../../../services/BoardService";
import { ButtonIcon } from "../../ButtonIcon";
import { showToast } from "../../../utils/tbToast";

export const BoardRow: React.FC<{
  projectSlug: string;
  board: Board;
  update: () => void;
  onEdit: (board: Board) => void;
}> = ({ projectSlug, board, update, onEdit }) => {
  async function handlePositionUp(event: React.MouseEvent) {
    event.preventDefault();
    if (board.position === 0) return;
    await BoardService.shared.update(projectSlug, board.id, {
      title: board.title,
      position: Math.max(0, board.position - 1),
    });
    update();
    showToast("success", "", "Board moved up");
  }
  async function handlePositionDown(event: React.MouseEvent) {
    event.preventDefault();
    await BoardService.shared.update(projectSlug, board.id, {
      title: board.title,
      position: board.position + 1,
    });
    update();
    showToast("success", "", "Board moved down");
  }
  async function handleEdit(event: React.MouseEvent) {
    event.preventDefault();
    onEdit(board);
  }

  async function handleToggleActive(event: React.MouseEvent) {
    event.preventDefault();
    await BoardService.shared.update(projectSlug, board.id, {
      title: board.title,
      isActive: !board.isActive,
    });
    update();
    showToast("success", "", `Board ${board.isActive ? "archived" : "restored"}`);
  }

  return (
    <NavLink
      to={ROUTES.BOARD_DETAILS(projectSlug, board.id)}
      style={{ display: "flex" }}
      className="flex justify-between items-center gap-4 border-b-gray-700 border-b h-12 px-2 bg-darkBlue hover:bg-hoverBlue"
    >
      <div
        className="flex-1 whitespace-nowrap overflow-x-hidden text-ellipsis"
        title={board.title}
      >
        {board.title}
      </div>
      <div className="flex-1 flex justify-center">
        <img
          className="h-7 w-7 rounded-full"
          src={board.creator?.avatar}
          alt="avatar"
        />
      </div>
      <div className="flex-1 text-center">{board.tickets.length}</div>
      <div>
        <ButtonIcon onClick={handlePositionUp}>
          <FaChevronUp className="w-5 h-5" />
        </ButtonIcon>
        <ButtonIcon onClick={handlePositionDown}>
          <FaChevronDown className="w-5 h-5" />
        </ButtonIcon>
        <ButtonIcon onClick={handleEdit}>
          <FaPencil className="w-5 h-5" />
        </ButtonIcon>
        <ButtonIcon onClick={handleToggleActive}>
          <FaArchive
            color={board.isActive ? undefined : "olive"}
            className="w-5 h-5"
          />
        </ButtonIcon>
      </div>
    </NavLink>
  );
};
