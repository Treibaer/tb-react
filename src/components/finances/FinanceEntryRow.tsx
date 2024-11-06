import { AccountEntry } from "../../models/finances/account-entry";
import { FormatType, formatUnixTimestamp } from "../../utils/dataUtils";

const FinanceEntryRow: React.FC<{
  entry: AccountEntry;
}> = ({ entry }) => {
  return (
    <div
      className="tb-row flex gap-2 items-center cursor-pointer select-none px-4"
    >
      <div className="w-8 h-8 bg-lighter rounded-full text-center p-1">
        {entry.icon}
      </div>
      <div className="flex-1  md:order-3">{entry.title}</div>
      <div className="flex flex-col gap-1 md:items-center md:flex-row md:gap-2 md:order-1">
        <div className="text-right md:order-2">
          <div
            className={`
                ${entry.valueInCents < 0 ? "text-stone-500" : "text-green-700"}
                text-end w-20
                `}
          >
            {(entry.valueInCents / 100).toFixed(2)}€
          </div>
        </div>
        <div className="text-xs md:text-sm text-right text-gray-400">
          {formatUnixTimestamp(entry.purchasedAt, FormatType.DAY)}
        </div>
      </div>
    </div>
  );
};
export default FinanceEntryRow;
