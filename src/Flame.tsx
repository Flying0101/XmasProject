import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, MeshStandardMaterial } from "three";

interface FlameProps {
  position: [number, number, number];
  isLit: boolean;
}

function Flame({ position, isLit }: FlameProps) {
  const flameRef = useRef<Mesh>(null);
  const flickerTime = useRef(0);

  useFrame((state) => {
    if (flameRef.current && isLit) {
      flickerTime.current += state.clock.getDelta();

      const fastFlicker = Math.sin(flickerTime.current * 15) * 0.15;
      const mediumFlicker = Math.sin(flickerTime.current * 7) * 0.1;
      const slowFlicker = Math.sin(flickerTime.current * 3) * 0.05;
      const flicker = fastFlicker + mediumFlicker + slowFlicker;

      flameRef.current.scale.set(
        0.15 + flicker * 0.1,
        0.25 + flicker * 0.15,
        0.15 + flicker * 0.1,
      );

      flameRef.current.position.x =
        position[0] + Math.sin(flickerTime.current * 4) * 0.03;
      flameRef.current.position.y = position[1];
      flameRef.current.position.z =
        position[2] + Math.cos(flickerTime.current * 4) * 0.03;

      const material = flameRef.current.material as MeshStandardMaterial;
      if (material) {
        material.emissiveIntensity = 2.5 + flicker;
      }
    }
  });

  if (!isLit) return null;

  return (
    <>
      <mesh ref={flameRef} position={position}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshStandardMaterial
          color="#ff9933"
          emissive="#ffdd99"
          emissiveIntensity={2.5}
          transparent={true}
          opacity={0.9}
        />
      </mesh>
      <pointLight
        position={position}
        distance={3}
        intensity={0.8}
        color="#ff9933"
      />
      <pointLight
        position={[position[0], position[1] + 0.1, position[2]]}
        distance={1.5}
        intensity={0.4}
        color="#ffdd99"
      />
    </>
  );
}

export default Flame;
