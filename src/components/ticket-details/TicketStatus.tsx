import {
  CheckCircleIcon,
  EllipsisHorizontalCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

export const TicketStatus: React.FC<{
  status: "done" | "inProgress" | "open";
}> = ({ status }) => {
  return (
    <div className="flex gap-1 items-center capitalize">
      {status === "open" && (
        <InformationCircleIcon className="h-5 w-5 text-gray-400" />
      )}
      {status === "inProgress" && (
        <EllipsisHorizontalCircleIcon className="h-5 w-5 text-yellow-600" />
      )}
      {status === "done" && (
        <CheckCircleIcon className="h-5 w-5 text-green-800" />
      )}
      {status}
    </div>
    // <div>{status}</div>
  );
};

export default TicketStatus;
