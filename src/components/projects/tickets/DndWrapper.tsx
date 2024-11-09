import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";

export declare type Identifier = string | symbol;

interface DragItem {
  id: number;
}

const DnDWrapper: React.FC<{
  dragIndex: number;
  setDragIndex: (index: number) => void;
  hoverIndex: number;
  setHoverIndex: (index: number) => void;
  id: number;
  children: React.ReactNode;
  moveTicket: (dragIndex: number, hoverIndex: number) => void;
}> = ({
  dragIndex,
  setDragIndex,
  hoverIndex,
  setHoverIndex,
  id,
  children,
  moveTicket,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [_, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = id;
      setHoverIndex(hoverIndex);
      setDragIndex(dragIndex);
    },
    drop(item: DragItem) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.id;
      const hoverIndex = id;
      setHoverIndex(-1);
      setDragIndex(-1);
      moveTicket(dragIndex, hoverIndex);
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      setDragIndex(id);
      return { id };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      style={{
        opacity: id === dragIndex ? 0.5 : id === hoverIndex ? 0.2 : 1,
      }}
    >
      {children}
    </div>
  );
};

export default DnDWrapper;
