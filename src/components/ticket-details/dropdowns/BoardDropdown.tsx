import { SmallBoard } from "../../../models/board-structure";
import { StyleProps } from "../../../models/style-props";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const BoardDropdown: React.FC<{
  selectedBoardId: number;
  boards: SmallBoard[];
  onClose: (boardId: number | null) => void;
  style?: StyleProps;
}> = ({ boards, onClose, selectedBoardId, style }) => {
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
      </DropdownElement>
      {boards.map((board) => (
        <DropdownElement
          key={board.id}
          isSelected={board.id === selectedBoardId}
          onClick={onChange.bind(this, board.id)}
        >
          {board.title}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default BoardDropdown;
