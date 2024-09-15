import { useEffect, useRef, useState } from "react";
import Dialog from "../../components/common/Dialog";
import { PasswordEnvironment } from "../../models/passwords/password-environment";
import { PasswordService } from "../../services/PasswordService";

export const PasswordCreationDialog: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [error, setError] = useState<string | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const defaultLoginRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  async function handleCreateEnvironment() {
    setError(undefined);

    const title = inputRef.current?.value;
    if (title) {
      try {
        const newEnvironment: PasswordEnvironment = {
          id: 0,
          title,
          defaultLogin: defaultLoginRef.current?.value ?? "",
          numberOfEntries: 0,
        };
        await PasswordService.shared.create(newEnvironment);
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
        title="Create Environment"
        onClose={onClose}
        onSubmit={handleCreateEnvironment}
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

export default PasswordCreationDialog;
