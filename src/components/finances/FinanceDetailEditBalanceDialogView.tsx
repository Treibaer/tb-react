import { useRef, useState } from "react";
import { FinanceService } from "../../services/FinanceService";
import Dialog from "../common/Dialog";

const FinanceDetailEditBalanceDialogView: React.FC<{
  value: number;
  onClose: (reload: boolean) => void;
}> = ({ value, onClose }) => {
  const valueRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  async function onSubmit() {
    const value = parseFloat(
      (valueRef.current?.value ?? "0").replace(",", ".")
    );

    if (!value) {
      setError("Value is required");
      return;
    }
    setError(undefined);

    try {
      await FinanceService.shared.updateBalance(value * 100);
      onClose(true);
    } catch (error: Error | any) {
      setError(error.message);
    }
  }

  return (
    <>
      <Dialog
        title={`Finances > Update Balance`}
        onClose={() => onClose(false)}
        onSubmit={onSubmit}
        error={error}
        submitTitle={"Update"}
      >
        <input
          type="text"
          placeholder="Balance"
          id="dialogTitle"
          className="tb-textarea"
          defaultValue={(value / 100).toFixed(2)}
          style={{
            boxShadow: "none",
            outline: "none",
          }}
          ref={valueRef}
        />
      </Dialog>
    </>
  );
};

export default FinanceDetailEditBalanceDialogView;
