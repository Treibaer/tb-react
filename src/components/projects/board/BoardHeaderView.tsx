export const BoardHeaderView = () => {
  return (
    <div className="flex justify-between items-center gap-4 text-lg font-semibold px-2">
      <div className="flex-1">Title</div>
      <div className="flex-1 text-center">Creator</div>
      <div className="flex-1 text-center">Tickets</div>
      <div className="flex-1 text-center">Start Date</div>
      <div className="flex-1 text-center">End Date</div>
    </div>
  );
};
