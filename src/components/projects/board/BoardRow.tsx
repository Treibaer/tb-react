import { NavLink } from "react-router-dom";
import { Board } from "../../../models/board-structure";
import { FormatType, formatUnixTimestamp } from "../../../utils/dataUtils";

export const BoardRow: React.FC<{ projectSlug: string; board: Board }> = ({
  projectSlug,
  board,
}) => {
  return (
    <NavLink
      to={`/projects/${projectSlug}/boards/${board.id}`}
      style={{ display: "flex" }}
      className="flex justify-between items-center gap-4 border-b-gray-700 border-b h-12 px-2 bg:[rgb(25,26,35)] hover:bg-[rgb(28,29,42)]"
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
  );
};
