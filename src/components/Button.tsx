interface ButtonProps {
  title: string;
  onClick?: () => void;
}

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      className="bg-customBlue px-3 text-nowrap inline rounded-custom-tb h-7 border-solid border border-slate-700 hover:bg-lightBlue"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

// export const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
// };
