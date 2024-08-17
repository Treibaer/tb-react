const Dialog: React.FC<{
  title: string;
  submitTitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}> = ({ title, submitTitle = "Create", onClose, onSubmit, children }) => {
  return (
    <div className="blurredBackground" onClick={onClose}>
      <div
        className="tb-dialog tb-transparent-menu"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="title-bar">
          <div>{title}</div>
          <div className="closeButton">
            <button className="tb-button" onClick={onClose}>
              X
            </button>
          </div>
        </div>

        {children}
        <div className="action-bar">
          <button className="tb-button" onClick={onSubmit}>
            {submitTitle ?? "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
