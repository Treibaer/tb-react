interface ButtonIconProps {
  children: React.ReactNode;
  dataCy?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({
  onClick,
  children,
  dataCy,
}) => {
  return (
    <button
      className="text-gray-400 rounded p-1 hover:bg-hover hover:shadow-2xl border border-transparent hover:border hover:border-border"
      onClick={onClick}
      data-cy={dataCy}
    >
      {children}
    </button>
  );
};
