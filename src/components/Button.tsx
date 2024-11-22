import { ComponentPropsWithoutRef } from "react";

type ButtonProps = {
  title: string;
  onClick?: () => void;
  dataCy?: string;
} & ComponentPropsWithoutRef<"button">;

export default function Button({ title, onClick, dataCy }: ButtonProps) {
  return (
    <button
      data-cy={dataCy}
      className="bg-row px-3 text-nowrap inline rounded-custom-tb h-7 border border-border hover:bg-hover"
      onClick={onClick}
    >
      {title}
    </button>
  );
}
