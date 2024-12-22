import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Candle from "./Candle";
import { Suspense } from "react";
import { useSocket } from "./hooks/useSocket";

function App() {
  const { connected, candleState, userCount, toggleCandle } = useSocket(
    import.meta.env.SERVER_URL || "http://localhost:3000",
  );

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <div className="mb-4">
        <div>Connection status: {connected ? "Connected" : "Disconnected"}</div>
        <div>Users in room: {userCount}</div>
        <div>Candle state : {candleState}</div>
        <button
          onClick={toggleCandle}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {candleState ? "Turn Off Candle" : "Turn On Candle"}
        </button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <color attach="background" args={["#f0f0f0"]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Candle position={[0, 0, 0]} scale={[2, 2, 2]} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
