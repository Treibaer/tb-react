import { InformationCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export const Notification: React.FC = () => {
  const [fadeOut, setFadeOut] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setFadeOut(true);
      setTimeout(() => {
        setIsHidden(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`tb-toast-2 ${isHidden ? "hidden" : undefined} ${
        fadeOut ? "opacity-0" : undefined
      }`}
    >
      <div className="tb-toast-2-content">
        <InformationCircleIcon className="size-5 text-gray-400" />
        <div className="tb-toast-2-text">
          <div className="tb-toast-2-title">OT-5 updated</div>
          <div className="tb-toast-2-content-2-hint">Successfully updated</div>
        </div>
        <XMarkIcon className="size-5 text-gray-400 cursor-pointer" />
      </div>
    </div>
  );
};
