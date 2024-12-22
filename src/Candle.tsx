import React from "react";
import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";

function Candle(props: GroupProps) {
  const { scene } = useGLTF(
    "/models/candle/scene.gltf",
    undefined,
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    }
  );

  return <primitive object={scene} {...props} />;
}

// Clean up loaded model when component unmounts
useGLTF.preload("./models/candle/scene.gltf");

export default Candle;
