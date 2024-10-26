import "./LoadingSpinner.css";
import { motion } from "framer-motion";

const BlurredBackground: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
}> = ({ onClose, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fullscreenBlurWithLoading"
      onClick={onClose}
    >
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </motion.div>
  );
};

export default BlurredBackground;
