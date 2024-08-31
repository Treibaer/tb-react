const TicketDetailsRow: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => {
  return (
    <div className="flex">
      <div className="min-w-20 h-8 py-1 px-2 text-gray-400">{title}</div>
      <div className="min-w-20 h-8 py-1 px-2 text-white">{children}</div>
    </div>
  );
};

export default TicketDetailsRow;
