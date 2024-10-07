import { useState, useEffect } from "react";

const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize); // Add listener on resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up listener on unmount
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
