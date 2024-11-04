import { useEffect, useState } from "react";
import socket from "../services/socket";
import { Listener, Wrapper } from "../models/websocket";
import { v4 as uuidv4 } from 'uuid'; // npm install uuid for generating unique IDs


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
  const pendingRequests: Record<string, (value: any) => void> = {}; // Store callbacks

  function emit(event: string, type: string, data: any, requestId?: string) {
    socket.emit(event, { type, data, requestId });
  }


  function request<T>(event: string, type: string, data: any): Promise<T> {
    const requestId = uuidv4(); // Unique ID for this request
    return new Promise<T>((resolve) => {
      pendingRequests[requestId] = resolve;
      emit(event, type, data, requestId);
    });
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

    function onRealtimeEvent(value: Wrapper<any>) {
      const { requestId, type, data } = value;
      
      // Check if this is a response to a pending request
      if (requestId && pendingRequests[requestId]) {
        pendingRequests[requestId](data); // Resolve the promise
        delete pendingRequests[requestId]; // Remove the request
        return;
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
    socket.on("realtime", onRealtimeEvent);

    socket.connect();
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("legacy", onAuthEvent);
      socket.off("matches", onMatchesEvent);
      socket.off("realtime", onRealtimeEvent);
    };
  }, []);

  return {
    isConnected,
    listenOn,
    listenOff,
    emit,
    request
  };
};
