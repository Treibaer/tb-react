const Dialog: React.FC<{
  title: string;
  submitTitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactNode;
}> = (props) => {
  return (
    <div className="blurredBackground" onClick={props.onClose}>
      <div
        className="tb-dialog tb-transparent-menu"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="title-bar">
          <div>{props.title}</div>
          <div className="closeButton">
            <button className="tb-button" onClick={props.onClose}>
              X
            </button>
          </div>
        </div>

        {props.children}
        <div className="action-bar">
          <button className="tb-button" onClick={props.onSubmit}>
            {props.submitTitle ?? "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
