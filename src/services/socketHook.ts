import { useSocket } from "../hooks/useSocket";

export default function useSocketHook() {
  const socket = useSocket();

  async function get<T>(data: any): Promise<T> {
    return await socket.request<T>("realtime", "boardStructure", data);
  }

  return {
    socket,
    get,
  };
}
