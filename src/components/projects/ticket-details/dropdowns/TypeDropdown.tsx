import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const TypeDropdown: React.FC<{
  selectedType: string;
  types: string[];
  onClose: (status: string | null) => void;
  style?: React.CSSProperties;
}> = ({ types, onClose, selectedType, style }) => {
  async function onChange(type: string) {
    onClose(type);
  }

  return (
    <TicketDetailsDropdown
      onClose={onClose}
      toggleId="typeDropdown"
      style={style}
    >
      {types.map((type) => (
        <DropdownElement
          key={type}
          isSelected={type === selectedType}
          dataCy={`type-${type}`}
          onClick={onChange.bind(this, type)}
        >
          {type}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default TypeDropdown;
