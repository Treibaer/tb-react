export const DropdownElement: React.FC<{
  children: React.ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
}> = ({ children, isSelected, onClick, onMouseOver }) => {
  return (
    <div
      className={`tb-dropdown-item cursor-pointer whitespace-nowrap overflow-hidden ${
        isSelected ? "tb-selected" : ""
      }`}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      {children}
    </div>
  );
};

export default DropdownElement;
