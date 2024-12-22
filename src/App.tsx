import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Candle from "./Candle";
import { Suspense } from "react";

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
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
