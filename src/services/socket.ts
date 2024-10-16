import { io } from "socket.io-client";

const token = localStorage.getItem("token");
const URL = process.env.NODE_ENV === 'production' ? "" : `ws://192.168.2.47:2389?token=${token}`;

const socket = io(URL, {
  autoConnect: false,
  transports: ["websocket"],
});

export default socket;
