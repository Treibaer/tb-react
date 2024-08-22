import TicketDetailsDropdown from "./components/TicketDetailsDropdown";

export const TypeDropdown: React.FC<{
  types: string[];
  onClose: (status: string | null) => void;
}> = ({ types, onClose }) => {
  async function onChange(type: string) {
    onClose(type);
  }

  return (
    <TicketDetailsDropdown onClose={onClose} toggleId="typeDropdown">
      {types.map((type) => (
        <div
          key={type}
          className="tb-dropdown-item"
          onClick={onChange.bind(this, type)}
        >
          {type}
        </div>
      ))}
    </TicketDetailsDropdown>
  );
};

export default TypeDropdown;
