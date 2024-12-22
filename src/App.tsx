import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Candle from "./Candle";

function App() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Canvas camera={{ position: [0, 0, 35] }}>
          <Environment files="/xmasbackground.jpg" background />
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} />
          <Candle position={[0, 0, 0]} scale={[2, 2, 2]} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </div>
  );
}

export default App;
