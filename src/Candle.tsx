import React from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three';

function Candle(props) {
  const { scene } = useGLTF("/models/candle/scene.gltf");
  
  // Clone the scene to avoid modifying the cached original
  const clonedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child.isMesh) {
        // Create a new red material
        child.material = new THREE.MeshStandardMaterial({
          color: '#ff0000',
          roughness: 0.5,
          metalness: 0.2,
        });
      }
    });
    return clone;
  }, [scene]);

  return <primitive object={clonedScene} {...props} />;
}

useGLTF.preload("/models/candle/scene.gltf");

export default Candle;