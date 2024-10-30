import { useRef, useState } from "react";
import { FinanceService } from "../../services/FinanceService";
import Dialog from "../common/Dialog";
import { useToast } from "../../store/ToastContext";

const FinanceDetailEditBalanceDialogView: React.FC<{
  value: number;
  onClose: (reload: boolean) => void;
}> = ({ value, onClose }) => {
  const valueRef = useRef<HTMLInputElement>(null);
  const {showToast} = useToast();

  async function onSubmit() {
    const value = parseFloat(
      (valueRef.current?.value ?? "0").replace(",", ".")
    );

    if (!value) {
      showToast("Error", "Value is required", "error");
      return;
    }

    try {
      await FinanceService.shared.updateBalance(value * 100);
      onClose(true);
      showToast("Success", "Balance updated");
    } catch (error: Error | any) {
      showToast("Error", error.message, "error");
    }
  }

  return (
    <>
      <Dialog
        title={`Finances > Update Balance`}
        onClose={() => onClose(false)}
        onSubmit={onSubmit}
        submitTitle={"Update"}
      >
        <input
          type="text"
          placeholder="Balance"
          className="tb-input mb-10"
          defaultValue={(value / 100).toFixed(2)}
          ref={valueRef}
        />
      </Dialog>
    </>
  );
};

export default FinanceDetailEditBalanceDialogView;
