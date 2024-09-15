interface ButtonIconProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  onClick,
  children,
}) => {
  return (
    <button
      className="text-gray-400 rounded p-1 hover:bg-[rgba(82,82,121,0.25)] hover:shadow-2xl border border-transparent hover:border hover:border-[rgba(82,82,111,0.44)]"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
