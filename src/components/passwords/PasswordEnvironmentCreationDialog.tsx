import { useEffect, useRef } from "react";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import { PasswordService } from "../../services/passwordService";
import { showToast } from "../../utils/tbToast";
import Dialog from "../common/Dialog";

export const PasswordEnvironmentCreationDialog: React.FC<{
  onClose: () => void;
  editingEntry: PasswordEnvironment | null;
}> = ({ onClose, editingEntry }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const defaultLoginRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (editingEntry) {
      inputRef.current!.value = editingEntry.title;
      defaultLoginRef.current!.value = editingEntry.defaultLogin;
    }
  }, [editingEntry]);

  async function handleCreateEnvironment() {
    const title = inputRef.current?.value;
    if (title) {
      try {
        const newEnvironment: PasswordEnvironment = {
          id: editingEntry?.id ?? 0,
          title,
          defaultLogin: defaultLoginRef.current?.value ?? "",
          numberOfEntries: 0,
        };
        if (editingEntry) {
          await PasswordService.shared.updateEnvironment(newEnvironment);
        } else {
          await PasswordService.shared.createEnvironment(newEnvironment);
        }
        onClose();
        showToast(
          "success",
          "",
          `Environment ${title} ${editingEntry ? "updated" : "created"}`
        );
      } catch (error: Error | any) {
        showToast("error", "", error.message);
      }
    } else {
      showToast("error", "", "Title is required");
    }
  }

  return (
    <>
      <Dialog
        title={editingEntry ? "Edit Environment" : "Create Environment"}
        onClose={onClose}
        onSubmit={handleCreateEnvironment}
        submitTitle={editingEntry ? "Save" : "Create"}
      >
        <input
          type="text"
          placeholder="Title"
          className="tb-input"
          ref={inputRef}
        />
        <input
          type="text"
          placeholder="Default Login"
          className="tb-input mb-10"
          ref={defaultLoginRef}
        />
      </Dialog>
    </>
  );
};

export default PasswordEnvironmentCreationDialog;
