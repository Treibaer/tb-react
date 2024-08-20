import { Button } from "../Button";

const Dialog: React.FC<{
  error?: string,
  title: string;
  submitTitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}> = ({ title, submitTitle = "Create", onClose, onSubmit, children, error }) => {
  return (
    <div className="blurredBackground" onClick={onClose}>
      {error && <div className="bg-red-300 w-1/2 mx-auto p-1 m-1 rounded text-slate-800">{error}</div>}
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
          <Button title={submitTitle ?? "Create"} onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
