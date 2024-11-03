import useIsMobile from "../../hooks/useIsMobile";
import Button from "../Button";
import { motion } from "framer-motion";

const Dialog: React.FC<{
  error?: string;
  title: string;
  submitTitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}> = ({
  title,
  submitTitle = "Create",
  onClose,
  onSubmit,
  children,
  error,
}) => {
  const isMobile = useIsMobile();

  return (
    <motion.div
      className="blurredBackground"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        if (!isMobile) {
          onClose();
        }
      }}
    >
      {error && (
        <div className="bg-red-300 w-1/2 mx-auto p-1 m-1 rounded text-slate-800 z-50 relative">
          {error}
        </div>
      )}
      <div
        className="backdrop-blur-xl bg-transparentDialog w-[calc(100vw-16px)] border border-border max-w-[500px] sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 sm:top-2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:-translate-y-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between mb-2 select-none">
          <div className="text-xl">{title}</div>
          <Button onClick={onClose} title="X" />
        </div>
        <div className="flex flex-col gap-2">{children}</div>
        <div className="absolute right-0 bottom-0 p-2">
          <Button title={submitTitle ?? "Create"} onClick={onSubmit} />
        </div>
      </div>
    </motion.div>
  );
};

export default Dialog;
