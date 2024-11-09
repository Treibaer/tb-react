import { useRef } from "react";
import { FinanceService } from "../../services/financeService";
import { showToast } from "../../utils/tbToast";
import Dialog from "../common/Dialog";

const FinanceDetailEditBalanceDialogView: React.FC<{
  value: number;
  onClose: (reload: boolean) => void;
}> = ({ value, onClose }) => {
  const valueRef = useRef<HTMLInputElement>(null);

  async function onSubmit() {
    const value = parseFloat(
      (valueRef.current?.value ?? "0").replace(",", ".")
    );

    if (!value) {
      showToast("error", "", "Value is required");
      return;
    }

    try {
      await FinanceService.shared.updateBalance(value * 100);
      onClose(true);
      showToast("success", "", "Balance updated");
    } catch (error: Error | any) {
      showToast("error", "", error.message);
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
