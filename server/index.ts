import { Server } from "socket.io";

interface ServerToClientEvents {
  candleState: (state: boolean[]) => void;
  userCount: (count: number) => void;
}

interface ClientToServerEvents {
  joinRoom: () => void;
  toggleCandle: (state: boolean[]) => void;
}

const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const ROOM_NAME = "candleRoom";
let candleState = [false, false, false, false];
let userCount = 0;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", () => {
    socket.join(ROOM_NAME);
    userCount++;

    socket.emit("candleState", candleState);
    io.to(ROOM_NAME).emit("userCount", userCount);
    console.log(`User ${socket.id} joined. Users in room: ${userCount}`);
  });

  socket.on("toggleCandle", (state) => {
    candleState = state;
    io.to(ROOM_NAME).emit("candleState", candleState);
    console.log(
      `Candle ${candleState ? "lit" : "extinguished"} by ${socket.id}`,
    );
  });

  socket.on("disconnect", () => {
    userCount = Math.max(0, userCount - 1);
    io.to(ROOM_NAME).emit("userCount", userCount);
    console.log(`User ${socket.id} left. Users in room: ${userCount}`);
  });
});

const PORT = process.env.PORT || 3000;
io.listen(PORT as number);
console.log(`Socket.IO server running on port ${PORT}`);
