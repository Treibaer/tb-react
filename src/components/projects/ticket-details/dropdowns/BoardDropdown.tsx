import { SmallBoard } from "../../../../models/board-structure";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const BoardDropdown: React.FC<{
  selectedBoardId: number;
  boards: SmallBoard[];
  onClose: (boardId: number | null) => void;
  style?: React.CSSProperties;
  showNumbers?: boolean;
}> = ({ boards, onClose, selectedBoardId, style, showNumbers }) => {
  async function onChange(boardId: number) {
    onClose(boardId);
  }

  return (
    <TicketDetailsDropdown
      onClose={onClose}
      toggleId="boardDropdown"
      style={style}
    >
      <DropdownElement
        isSelected={selectedBoardId === 0}
        onClick={onChange.bind(this, 0)}
      >
        No board
        {showNumbers && (
          <div className="absolute right-2 text-gray-400">[1]</div>
        )}
      </DropdownElement>
      {boards.map((board, index) => (
        <DropdownElement
          key={board.id}
          isSelected={board.id === selectedBoardId}
          onClick={onChange.bind(this, board.id)}
        >
          {board.title}
          {showNumbers && (
            <div className="absolute right-2 text-gray-400">[{index + 2}]</div>
          )}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default BoardDropdown;
