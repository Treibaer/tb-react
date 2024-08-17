import { Button } from "../Button";

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
            <Button onClick={onClose} title="X" />
          </div>
        </div>

        {children}
        <div className="action-bar">
          <Button title= {submitTitle ?? "Create"} onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
