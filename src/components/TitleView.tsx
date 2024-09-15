import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { ButtonIcon } from "./ButtonIcon";

export const TitleView: React.FC<{ title: string; openDialog: () => void }> = ({
  title,
  openDialog,
}) => {
  return (
    <div className="flex justify-start items-center gap-4 m-2 select-none">
      <div className="cursor-default text-3xl font-semibold">{title}</div>
      <ButtonIcon onClick={openDialog}>
        <PencilSquareIcon className="size-5" />
      </ButtonIcon>
    </div>
  );
};

export default TitleView;
