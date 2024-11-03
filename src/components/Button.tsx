import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  title: string;
  onClick?: () => void;
} & ComponentPropsWithoutRef<"button">;

export default function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      className="bg-row px-3 text-nowrap inline rounded-custom-tb h-7 border border-border hover:bg-hover"
      onClick={onClick}
    >
      {title}
    </button>
  );
}

// export const Button: React.FC<ButtonProps> = ({ title, onClick }) => {
// };
