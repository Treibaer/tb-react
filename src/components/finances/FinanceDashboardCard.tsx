const DashboardCard: React.FC<{
  title: string;
  value: number;
  subText?: string;
  valueClass?: string;
}> = ({ title, value, subText, valueClass = "" }) => (
  <div className="flex flex-col p-4 gap-2 bg-row rounded-xl hover:bg-hover cursor-default select-none">
    <div>{title}</div>
    <div className={`text-4xl ${valueClass}`}>
      {value.toFixed(2)}€
      {subText && <span className="text-sm text-gray-400"> {subText}</span>}
    </div>
  </div>
);

export default DashboardCard;
