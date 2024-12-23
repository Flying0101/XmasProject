import { Server } from "socket.io";

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

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: ["http://localhost:5173", "http://161.35.210.135:5173"],
    methods: ["GET", "POST"],
  },
});

const ROOM_NAME = "candleRoom";
const INITIAL_CANDLE_LENGTH = 1;
const BURN_RATE = 0.1;
const BURN_INTERVAL = 3000;

const getInitialState = (): CandlesState => [
  [false, INITIAL_CANDLE_LENGTH],
  [false, INITIAL_CANDLE_LENGTH],
  [false, INITIAL_CANDLE_LENGTH],
  [false, INITIAL_CANDLE_LENGTH],
];

let candlesState: CandlesState = getInitialState();
let userCount = 0;

const resetCandles = () => {
  candlesState = getInitialState();
  io.to(ROOM_NAME).emit("candleState", candlesState);
  console.log("Candles reset to initial state");
};

// Timer to burn candles
setInterval(() => {
  if (!Array.isArray(candlesState)) {
    resetCandles();
    return;
  }

  if (candlesState.every(([_, length]) => length === 0)) {
    resetCandles();
    return;
  }

  let stateChanged = false;
  candlesState = candlesState.map(([isOn, length]): CandleState => {
    if (isOn && length > 0) {
      stateChanged = true;
      return [isOn, Math.max(0, length - BURN_RATE)];
    }
    return [isOn, length];
  });

  if (stateChanged) {
    io.to(ROOM_NAME).emit("candleState", candlesState);
  }
}, BURN_INTERVAL);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", () => {
    socket.join(ROOM_NAME);
    userCount++;

    if (!Array.isArray(candlesState)) {
      resetCandles();
    }

    socket.emit("candleState", candlesState);
    io.to(ROOM_NAME).emit("userCount", userCount);
    console.log(`User ${socket.id} joined. Users in room: ${userCount}`);
  });

  socket.on("toggleCandle", (candleIndex: number) => {
    if (
      !Array.isArray(candlesState) ||
      candleIndex < 0 ||
      candleIndex >= candlesState.length
    ) {
      return;
    }

    const currentCandle = candlesState[candleIndex];
    if (!Array.isArray(currentCandle)) {
      return;
    }

    const [isOn, length] = currentCandle;

    if (length > 0) {
      candlesState[candleIndex] = [!isOn, length];
      io.to(ROOM_NAME).emit("candleState", candlesState);
      console.log(
        `Candle ${candleIndex} ${!isOn ? "lit" : "extinguished"} by ${socket.id}`,
      );
    }
  });

  socket.on("disconnect", () => {
    userCount = Math.max(0, userCount - 1);
    io.to(ROOM_NAME).emit("userCount", userCount);
    console.log(`User ${socket.id} left. Users in room: ${userCount}`);
  });
});

const PORT = process.env.PORT || 3000;
io.listen(PORT);
console.log(`Socket.IO server running on port ${PORT}`);
