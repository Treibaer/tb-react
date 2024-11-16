export const DropdownElement: React.FC<{
  children: React.ReactNode;
  isSelected: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
  dataCy?: string;
}> = ({ children, isSelected, onClick, onMouseOver, dataCy }) => {
  return (
    <div
      className={`tb-dropdown-item cursor-pointer whitespace-nowrap overflow-hidden ${
        isSelected ? "tb-selected" : ""
      }`}
      onClick={onClick}
      onMouseOver={onMouseOver}
      data-cy={dataCy}
    >
      {children}
    </div>
  );
};

export default DropdownElement;
