import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type CandleState = [boolean, number]; // [isOn, length]
type CandlesState = CandleState[];

interface ServerToClientEvents {
  candleState: (state: CandlesState) => void;
  userCount: (count: number) => void;
}

interface ClientToServerEvents {
  joinRoom: () => void;
  toggleCandle: (candleIndex: number) => void;
}

export function useSocket(url: string) {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(
    () => io(url),
  );
  const [connected, setConnected] = useState(false);
  const [candlesState, setCandlesState] = useState<CandlesState>([
    [false, 1],
    [false, 1],
    [false, 1],
    [false, 1],
  ]);
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
      setCandlesState(state);
      console.log("Candles state:", state);
    });

    socket.on("userCount", (count) => {
      setUserCount(count);
      console.log("Users in room:", count);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const toggleCandle = (candleIndex: number) => {
    console.log("toggle", candleIndex);
    socket.emit("toggleCandle", candleIndex);
  };

  return {
    connected,
    candlesState,
    userCount,
    toggleCandle,
    socket,
  };
}
