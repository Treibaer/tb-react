import { useEffect, useRef } from "react";
import useIsMobile from "../../../../hooks/useIsMobile";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      ref={dropdownRef}
      className={`ticket-details-dropdown tb-transparent-menu py-1 max-w-[236px]`}
      style={style2}
    >
      {children}
    </motion.div>
  );
};

export default TicketDetailsDropdown;
