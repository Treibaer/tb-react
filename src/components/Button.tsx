interface ButtonProps {
  title: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <button className="tb-button" onClick={onClick}>
      {title}
    </button>
  );
};
