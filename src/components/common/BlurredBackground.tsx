import "./LoadingSpinner.css";

const BlurredBackground: React.FC<{
  onClose: () => void;
  children: React.ReactNode;
}> = ({ onClose, children }) => {
  return (
    <div className="fullscreenBlurWithLoading" onClick={onClose}>
      <div onClick={(event) => event.stopPropagation()}>{children}</div>
    </div>
  );
};

export default BlurredBackground;
