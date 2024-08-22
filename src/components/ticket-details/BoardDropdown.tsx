import { SmallBoard } from "../../models/board-structure";
import TicketDetailsDropdown from "./components/TicketDetailsDropdown";

export const BoardDropdown: React.FC<{
  boards: SmallBoard[];
  onClose: (boardId: number | null) => void;
}> = ({ boards, onClose }) => {
  async function onChange(boardId: number) {
    onClose(boardId);
  }

  return (
    <TicketDetailsDropdown onClose={onClose} toggleId="boardDropdown">
      <div
        className="tb-dropdown-item nowrap overflow-hidden whitespace-nowrap"
        onClick={onChange.bind(this, 0)}
      >
        No board
      </div>
      {boards.map((board) => (
        <div
          key={board.id}
          className="tb-dropdown-item nowrap overflow-hidden whitespace-nowrap"
          onClick={onChange.bind(this, board.id)}
        >
          {board.title}
        </div>
      ))}
    </TicketDetailsDropdown>
  );
};

export default BoardDropdown;
