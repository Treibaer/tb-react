export const BoardHeaderView = () => {
  return (
    <div className="flex justify-between items-center gap-4 text-lg font-semibold p-2 bg-mediumBlue">
      <div className="flex-1">Title</div>
      <div className="flex-1 text-center">Creator</div>
      <div className="flex-1 text-center">Tickets</div>
      <div className="flex-1 text-center">Actions</div>
    </div>
  );
};
