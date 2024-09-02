import express from "express";
import { Status } from "../models/status.js";

const router = express.Router();

router.get("/status", async (_, res) => {
  let status = await Status.findAll();
  const status2: (Status & { up: boolean })[] = status.map((s) => s.toJSON());
  for (const s of status2) {
    s.up = false;
  }
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  await Promise.all(
    status2.map(async (s) => {
      try {
        if (s.host.startsWith("ws://") || s.host.startsWith("wss://")) {
          s.up = await checkWebSocketReachability(s.host, s.port);
        } else {
          await fetch(`${s.host}:${s.port}`);
          s.up = true;
        }
      } catch (error: any) {
        s.up = false;
      }
    })
  );
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1";
  res.status(200).json(status2);
});

async function checkWebSocketReachability(
  url: string,
  port: number
): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    const fullUrl = `${url}:${port}`;
    const socket = new WebSocket(fullUrl);

    // Listen for the open event to know the connection was successful
    socket.onopen = () => {
      socket.close();
      resolve(true);
    };

    // Listen for error events which indicate that the connection failed
    socket.onerror = () => {
      resolve(false);
    };

    // Also handle the case where the connection is closed before being established
    socket.onclose = (event) => {
      if (!event.wasClean) {
        resolve(false);
      }
    };
  });
}

export default router;
