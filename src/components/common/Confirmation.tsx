import { motion } from "framer-motion";
import Button from "../Button";
import BlurredBackground from "./BlurredBackground";

const Confirmation: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
}> = ({ onConfirm, onCancel, title, message }) => {
  return (
    <BlurredBackground onClose={onCancel}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background mt-2 border border-border rounded p-4 flex flex-col gap-2 items-center justify-center
    "
      >
        <div className="text-2xl">{title ?? "Are you sure?"}</div>
        <p>{message ?? "Do you really want to remove?"}</p>
        <div className="flex gap-2">
          <Button onClick={onCancel} title="No" />
          <Button onClick={onConfirm} title="Yes" />
        </div>
      </motion.div>
    </BlurredBackground>
  );
};

export default Confirmation;
