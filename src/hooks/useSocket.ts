// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  candleState: (state: boolean) => void;
  userCount: (count: number) => void;
}

interface ClientToServerEvents {
  joinRoom: () => void;
  toggleCandle: (state: boolean) => void;
}

export function useSocket(url: string) {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(
    () => io(url),
  );
  const [connected, setConnected] = useState(false);
  const [candleState, setCandleState] = useState(false);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom");

    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Disconnected from server");
    });

    socket.on("candleState", (state) => {
      setCandleState(state);
      console.log("Candle state:", state);
    });

    socket.on("userCount", (count) => {
      setUserCount(count);
      console.log("Users in room:", count);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const toggleCandle = () => {
    const newState = !candleState;
    socket.emit("toggleCandle", newState);
  };

  return {
    connected,
    candleState,
    userCount,
    toggleCandle,
    socket,
  };
}
