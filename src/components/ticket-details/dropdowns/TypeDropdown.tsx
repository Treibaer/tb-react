import { StyleProps } from "../../../models/style-props";
import DropdownElement from "./DropdownElement";
import TicketDetailsDropdown from "./TicketDetailsDropdown";

export const TypeDropdown: React.FC<{
  selectedType: string;
  types: string[];
  onClose: (status: string | null) => void;
  style?: StyleProps;
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
          onClick={onChange.bind(this, type)}
        >
          {type}
        </DropdownElement>
      ))}
    </TicketDetailsDropdown>
  );
};

export default TypeDropdown;
