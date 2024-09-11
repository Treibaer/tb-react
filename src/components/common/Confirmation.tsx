import Button from "../Button";

const Confirmation: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="bg-[rgb(32,33,46)] mt-2 border border-[rgb(53,56,74)] rounded p-4 flex flex-col gap-2 items-center justify-center
    "
    >
      <div className="text-2xl">Are you sure?</div>
      <p>Do you really want to remove?</p>
      <div className="flex gap-2">
        <Button onClick={onCancel} title="No" />
        <Button onClick={onConfirm} title="Yes" />
      </div>
    </div>
  );
};

export default Confirmation;
