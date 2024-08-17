interface ButtonProps {
  title: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <button
      className="bg-customBlue px-3 rounded-custom-tb h-7 border-solid border border-slate-700 hover:bg-slate-700"
      onClick={onClick}
    >
      {title}
    </button>
  );
};
