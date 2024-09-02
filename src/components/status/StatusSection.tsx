import { Status } from "../../models/status";
import LoadingSpinner from "../common/LoadingSpinner";

const StatusSection: React.FC<{ title: string; states: Status[] }> = ({
  title,
  states,
}) => {
  if (states.length === 0) {
    return <LoadingSpinner />;
  }
  return (
    <div className="flex flex-col bg-[#262736] rounded-xl m-2 min-w-[calc(50%-16px)]">
      <div className="text-3xl text-center my-1">{title}</div>
      {states.map((s) => (
        <div key={s.id} className="flex justify-between items-center p-4">
          <div className={`flex-1 ${s.up ? "text-green-700" : "text-red-700"}`}>
            {s.title}
          </div>
          <div className=" flex-1">
            <a href={`${s.host}:${s.port}`} target="_blank" rel="noreferrer">
              {s.host}:{s.port}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatusSection;
