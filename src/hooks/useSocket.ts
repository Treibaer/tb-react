import { useEffect, useState } from "react";
import socket from "../services/socket";
import { Listener, Wrapper } from "../models/websocket";

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const matchListeners: Listener[] = [];

  function listenOn(
    event: string,
    type: string,
    fn: (value: Wrapper<any>) => void
  ) {
    if (event === "matches") {
      matchListeners.push({ event, type, fn });
    }
  }
  function listenOff(event: string, type: string) {
    if (event === "matches") {
      matchListeners.splice(
        matchListeners.findIndex((l) => l.event === event && l.type === type),
        1
      );
    }
  }

  function emit(event: string, type: string, data: any) {
    socket.emit(event, { type, data });
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onAuthEvent(value: Wrapper<any>) {
      if (value.type === "requestAuthentication") {
        socket.emit("matches", {
          type: "authentication",
          id: 0,
        });
      }
    }

    function onMatchesEvent(value: Wrapper<any>) {
      if (value.type === "authentication") {
        console.log("auth", value.data);
        return;
      }

      matchListeners.forEach((listener) => {
        if (listener.event === "matches" && listener.type === value.type) {
          listener.fn(value.data);
        }
      });

      console.log("event", value);
      switch (value.type) {
        case "update":
          break;
        default:
          console.log("Unknown type: ", value.type);
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("legacy", onAuthEvent);
    socket.on("matches", onMatchesEvent);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("legacy", onAuthEvent);
      socket.off("matches", onMatchesEvent);
    };
  }, []);

  return {
    isConnected,
    listenOn,
    listenOff,
    emit,
  };
};
