import { useEffect, useRef } from "react";

export const TicketDetailsDropdown: React.FC<{
  children: React.ReactNode;
  onClose: (value: null) => void;
  className?: string;
  toggleId: string;
}> = ({ children, onClose, className = "left-20 w-[142px]", toggleId }) => {
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
      className={`ticket-details-dropdown tb-transparent-menu ${className}`}
    >
      {children}
    </div>
  );
};

export default TicketDetailsDropdown;
