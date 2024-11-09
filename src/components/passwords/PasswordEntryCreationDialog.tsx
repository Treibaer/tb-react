import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { PasswordEntry } from "../../models/passwords/password-entry";
import { PasswordService } from "../../services/passwordService";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import useIsMobile from "../../hooks/useIsMobile";
import Button from "../Button";
import { showToast } from "../../utils/tbToast";

export const PasswordEntryCreationDialog: React.FC<{
  environment: PasswordEnvironment;
  editingEntry: PasswordEntry | null;
  onClose: () => void;
}> = ({ onClose, environment, editingEntry }) => {
  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
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
          archived: editingEntry?.archived ?? false,
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
        showToast(
          "success",
          "",
          `Entry ${editingEntry ? "updated" : "created"}`
        );
      } catch (error: Error | any) {
        showToast("error", "", error.message);
      }
    } else {
      showToast("error", "", "Please enter a title");
    }
  }

  function copyUser() {
    navigator.clipboard.writeText(loginRef.current!.value);
    showToast("success", "", "Copied user to clipboard");
  }

  function copyPass() {
    navigator.clipboard.writeText(editingEntry?.password ?? "");
    showToast("success", "", "Copied password to clipboard");
  }

  function showPass() {
    setIsShowingPassword((prev) => {
      passwordRef.current!.value = prev ? "" : editingEntry?.password ?? "";
      return !prev;
    });
    passwordRef.current!.value = editingEntry?.password ?? "";
  }

  return (
    <>
      <Dialog
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
        <div className="flex gap-1 items-center">
          <input
            type="text"
            autoComplete="new-password"
            placeholder="Login"
            className="tb-input"
            ref={loginRef}
          />
          <Button title="Copy" onClick={copyUser} />
        </div>
        <div className="flex gap-1 items-center">
          <input
            type="text"
            autoComplete="new-password"
            placeholder="Password"
            className="tb-input"
            ref={passwordRef}
          />

          <div className="flex gap-1 items-center">
            {editingEntry && (
              <Button
                title={isShowingPassword ? "Hide" : "Show"}
                onClick={showPass}
              />
            )}
            <Button title="Copy" onClick={copyPass} />
          </div>
        </div>
        <input
          type="text"
          autoComplete="new-password"
          placeholder="Url"
          className="tb-input"
          ref={urlRef}
        />
        <textarea
          placeholder="Notes"
          className="tb-input mb-9 h-32"
          ref={notesRef}
        ></textarea>
      </Dialog>
    </>
  );
};

export default PasswordEntryCreationDialog;
