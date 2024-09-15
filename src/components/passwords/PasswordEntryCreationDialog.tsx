import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { PasswordEntry } from "../../models/passwords/password-entry";
import { PasswordService } from "../../services/PasswordService";
import { PasswordEnvironment } from "../../models/passwords/password-environment";

export const PasswordEntryCreationDialog: React.FC<{
  environment: PasswordEnvironment;
  editingEntry: PasswordEntry | null;
  onClose: () => void;
}> = ({ onClose, environment, editingEntry }) => {
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
      // passwordRef.current!.value = editingEntry.password;
      urlRef.current!.value = editingEntry.url;
      notesRef.current!.value = editingEntry.notes;
    } else {
      loginRef.current!.value = environment.defaultLogin;
    }
  }, [editingEntry, environment]);

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
            environment.id,
            editingEntry.id,
            entry
          );
        } else {
          await PasswordService.shared.createEntry(environment.id, entry);
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
        title={editingEntry ? "Edit Entry" : "Create Entry"}
        onClose={onClose}
        onSubmit={handleCreateEntry}
        submitTitle={editingEntry ? "Update" : "Create"}
      >
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Title"
          className="tb-input"
          ref={inputRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Login"
          className="tb-input"
          ref={loginRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Password"
          className="tb-input"
          ref={passwordRef}
        />
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Url"
          className="tb-input"
          ref={urlRef}
        />
        <textarea
          placeholder="Notes"
          className="tb-input mb-10 h-32"
          ref={notesRef}
        ></textarea>
      </Dialog>
    </>
  );
};

export default PasswordEntryCreationDialog;
