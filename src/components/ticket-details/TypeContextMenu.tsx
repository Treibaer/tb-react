import { useEffect, useRef } from "react";

export const TypeContextMenu: React.FC<{
  types: string[];
  onClose: (status: string | null) => void;
}> = ({ types, onClose }) => {
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

  async function onTypeChange(type: string) {
    onClose(type);
  }

  return (
    <div
      ref={dropdownRef}
      className="max-h-64 overflow-y-auto  absolute select-none top-9 tb-container active tb-transparent-menu tb-context-menu show left-20 w-[140px]"
    >
      {types.map((type) => (
        <div
          key={type}
          className="tb-dropdown-item"
          onClick={onTypeChange.bind(this, type)}
        >
          {type}
        </div>
      ))}
    </div>
  );
};

export default TypeContextMenu;
