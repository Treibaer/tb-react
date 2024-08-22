import { useEffect, useRef } from "react";
import { SmallBoard } from "../../models/board-structure";

export const BoardContextMenu: React.FC<{
  boards: SmallBoard[];
  onClose: (boardId: number | null) => void;
}> = ({ boards, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !event.composedPath().includes(document.getElementById("typeDropdown")!)
    ) {
      onClose(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  async function onTypeChange(boardId: number) {
    onClose(boardId);
  }

  return (
    <div
      ref={dropdownRef}
      className="max-h-64 overflow-y-auto absolute select-none top-9 tb-container active tb-transparent-menu tb-context-menu show left-0 w-[240px]"
    >
      <div
        className="tb-dropdown-item nowrap overflow-hidden whitespace-nowrap"
        onClick={onTypeChange.bind(this, 0)}
      >
        No board
      </div>
      {boards.map((board) => (
        <div
          key={board.id}
          className="tb-dropdown-item nowrap overflow-hidden whitespace-nowrap"
          onClick={onTypeChange.bind(this, board.id)}
        >
          {board.title}
        </div>
      ))}
    </div>
  );
};

export default BoardContextMenu;
