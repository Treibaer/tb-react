import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { PasswordEntry } from "../../models/passwords/password-entry";
import { PasswordService } from "../../services/PasswordService";

export const PasswordEntryCreationDialog: React.FC<{
  environmentId: number;
  editingEntry: PasswordEntry | null;
  onClose: () => void;
}> = ({ onClose, environmentId, editingEntry }) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    if (editingEntry) {
      inputRef.current!.value = editingEntry.title;
      loginRef.current!.value = editingEntry.login;
      passwordRef.current!.value = editingEntry.password;
      urlRef.current!.value = editingEntry.url;
      notesRef.current!.value = editingEntry.notes;
    }
  }, [editingEntry]);

  async function handleCreateEntry() {
    setError(undefined);

    const title = inputRef.current?.value;
    if (title) {
      try {
        const entry: PasswordEntry = {
          id: editingEntry?.id ?? 0,
          title,
          login: loginRef.current?.value ?? "",
          password: passwordRef.current?.value ?? "",
          url: urlRef.current?.value ?? "",
          notes: notesRef.current?.value ?? "",
        };
        if (editingEntry) {
          await PasswordService.shared.updateEntry(
            environmentId,
            editingEntry.id,
            entry
          );
        } else {
          await PasswordService.shared.createEntry(environmentId, entry);
        }
        onClose();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  return (
    <>
      <Dialog
        error={error}
        title="Create Entry"
        onClose={onClose}
        onSubmit={handleCreateEntry}
      >
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Title"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={inputRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Login"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={loginRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Password"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={passwordRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Url"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={urlRef}
        />
        <textarea
          placeholder="Notes"
          className="tb-textarea"
          style={{ boxShadow: "none", outline: "none" }}
          ref={notesRef}
        ></textarea>
      </Dialog>
    </>
  );
};

export default PasswordEntryCreationDialog;
