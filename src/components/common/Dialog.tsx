import Button from "../Button";

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
  return (
    <div className="blurredBackground" onClick={onClose}>
      {error && (
        <div className="bg-red-300 w-1/2 mx-auto p-1 m-1 rounded text-slate-800">
          {error}
        </div>
      )}
      <div
        className="backdrop-blur-xl bg-transparent w-full max-w-[500px] sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
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
    </div>
  );
};

export default Dialog;
