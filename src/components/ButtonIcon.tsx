interface ButtonIconProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  onClick,
  children,
}) => {
  return (
    <button
      className="text-gray-400 rounded p-2 hover:bg-slate-700 "
      onClick={onClick}
    >
      {children}
    </button>
  );
};
