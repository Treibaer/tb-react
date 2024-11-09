import { useState } from "react";
import { TicketsContextMenuConfig } from "../models/tickets-context-menu-config";
import { Ticket } from "../models/ticket";
import { Board } from "../models/board-structure";
import { AccountEntry } from "../models/finances/account-entry";

interface UseContextMenuParams {
  refresh: () => void;
}

const useContextMenu = ({ refresh }: UseContextMenuParams) => {
  const [config, setConfig] = useState<TicketsContextMenuConfig>({
    top: 0,
    left: 0,
    show: false,
    value: null,
  });

  const openContextMenu = (
    event: React.MouseEvent,
    value: Ticket | AccountEntry,
    board?: Board
  ) => {
    event.preventDefault();
    setConfig({
      top: Math.min(event.pageY, window.innerHeight - 175),
      left: Math.min(event.pageX, window.innerWidth - 175),
      show: true,
      value: value,
      board,
    });
  };

  const openContextMenuTouch = (
    event: React.TouchEvent,
    value: Ticket | AccountEntry,
    board?: Board
  ) => {
    if (event.touches.length !== 2) {
      return;
    }
    const touch = event.touches[0];
    const touch1 = event.touches[1];
    setConfig({
      top: Math.min(touch.clientY, touch1.clientY),
      left: Math.min(touch.clientX, touch1.clientX),
      show: true,
      value: value,
      board,
    });
  };

  const closeContextMenu = async (shouldUpdate: boolean) => {
    setConfig({
      ...config,
      show: false,
      value: null,
    });
    if (shouldUpdate) refresh();
  };

  return {
    config,
    openContextMenu,
    openContextMenuTouch,
    closeContextMenu,
  };
};

export default useContextMenu;
