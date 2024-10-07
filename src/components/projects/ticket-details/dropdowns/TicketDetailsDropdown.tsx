import { useEffect, useRef } from "react";
import useIsMobile from "../../../../hooks/useIsMobile";

export const TicketDetailsDropdown: React.FC<{
  children: React.ReactNode;
  onClose: (value: null) => void;
  toggleId: string;
  style?: React.CSSProperties;
}> = ({ children, onClose, toggleId, style }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const height = isMobile ? 214 : 280;

  const style2 = {...style}
  const maxY = window.innerHeight - height - 5;
  if (Number(style2.top) > maxY) {
    style2.top = maxY;
  }


  style2.maxHeight = height;

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
      style={style2}
    >
      {children}
    </div>
  );
};

export default TicketDetailsDropdown;
