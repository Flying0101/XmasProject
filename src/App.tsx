import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Candle from "./Candle";
import { Suspense } from "react";
import { useSocket } from "./hooks/useSocket";

function App() {
  const {
    connected,
    candlesState = [
      [false, 1],
      [false, 1],
      [false, 1],
      [false, 1],
    ],
    userCount,
    toggleCandle,
  } = useSocket(import.meta.env.SERVER_URL || "http://localhost:3000");

  const candleRotations = useMemo(
    () =>
      Array(4)
        .fill(0)
        .map(() => Math.PI * 2 * Math.random()),
    [],
  );

  const candlePositions: [number, number, number][] = [
    [-3, 0, 0],
    [-1, 0, 0],
    [1, 0, 0],
    [3, 0, 0],
  ];

  if (!Array.isArray(candlesState)) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        touchAction: "none",
        userSelect: "none",
      }}
    >
      <div className="absolute top-0 left-0 m-4 z-10 bg-white/80 p-4 rounded-lg">
        <div>Connection status: {connected ? "Connected" : "Disconnected"}</div>
        <div>Users in room: {userCount}</div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 2, 40], fov: 50 }}>
          <color attach="background" args={["#1a1a1a"]} />

          <ambientLight intensity={0.2} />

          {candlesState.map(
            ([isOn], index) =>
              isOn && (
                <pointLight
                  key={`light-${index}`}
                  position={[
                    candlePositions[index][0],
                    candlePositions[index][1] + 2,
                    candlePositions[index][2],
                  ]}
                  intensity={0.5}
                  color="#FFD700"
                  distance={4}
                />
              ),
          )}

          {candlesState.map(([isOn, length], index) => (
            <group
              key={`candle-${index}`}
              position={candlePositions[index]}
              onClick={() => toggleCandle(index)}
            >
              <Candle
                scale={[1, 1, 1]}
                isOn={isOn}
                length={length}
                rotation={[0, candleRotations[index], 0]}
              />
            </group>
          ))}

          <OrbitControls
            makeDefault
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
            enableZoom={true}
            enablePan={false}
            enableDamping={true}
            dampingFactor={0.05}
            minDistance={20}
            maxDistance={85}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
