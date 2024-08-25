import { useEffect, useRef } from "react";
import { StyleProps } from "../../../models/style-props";

export const TicketDetailsDropdown: React.FC<{
  children: React.ReactNode;
  onClose: (value: null) => void;
  toggleId: string;
  style?: StyleProps;
}> = ({ children, onClose, toggleId, style }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      !event.composedPath().includes(document.getElementById(toggleId)!)
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

  return (
    <div
      ref={dropdownRef}
      className={`ticket-details-dropdown tb-transparent-menu py-1 max-w-[236px]`}
      style={style}
    >
      {children}
    </div>
  );
};

export default TicketDetailsDropdown;
