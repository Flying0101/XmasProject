import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import type { GroupProps } from "@react-three/fiber";
import { Group, Mesh, MathUtils, Euler } from "three";
import { useFrame } from "@react-three/fiber";
import Flame from "./Flame";

interface CandleProps extends GroupProps {
  isOn: boolean;
  length: number;
}

function Candle({ isOn, length, ...props }: CandleProps) {
  const groupRef = useRef<Group>(null);
  const flameGroupRef = useRef<Group>(null);
  const currentScale = useRef(length); // Initialize with prop value
  const currentRotation = useRef(0);
  const targetScale = useRef(length);
  const targetRotation = useRef(0);
  const isResetting = useRef(false);
  const initialRotation = useRef({
    x: props.rotation instanceof Euler ? props.rotation.x : 0,
    y: props.rotation instanceof Euler ? props.rotation.y : 0,
    z: props.rotation instanceof Euler ? props.rotation.z : 0,
  });

  const { scene } = useGLTF(
    "/models/candle/scene.gltf",
    undefined,
    undefined,
    (error) => {
      console.error("Error loading model:", error);
    },
  );

  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof Mesh) {
        child.material = child.material.clone();
        child.material.emissive?.setHex(0xffffff);
        child.material.emissiveIntensity = isOn ? 1 : 0.2;
      }
    });
  }, [isOn, clonedScene]);

  useEffect(() => {
    isResetting.current = currentScale.current < 0.1 && length === 1;
    targetScale.current = length;
    targetRotation.current += Math.PI / 8;
  }, [length]);

  useFrame(({}, delta) => {
    if (groupRef.current && flameGroupRef.current) {
      const baseScale = (props.scale as [number, number, number]) || [1, 1, 1];

      const transitionSpeed = isResetting.current ? 20 : 0.15;
      const lerpFactor = Math.min(delta * transitionSpeed, 1);

      currentScale.current = MathUtils.lerp(
        currentScale.current,
        targetScale.current,
        lerpFactor,
      );

      currentRotation.current = MathUtils.lerp(
        currentRotation.current,
        targetRotation.current,
        lerpFactor,
      );

      groupRef.current.scale.set(
        baseScale[0],
        baseScale[1] * currentScale.current,
        baseScale[2],
      );

      groupRef.current.rotation.set(
        initialRotation.current.x,
        initialRotation.current.y + currentRotation.current,
        initialRotation.current.z,
      );

      flameGroupRef.current.scale.set(
        1 / baseScale[0],
        1 / (baseScale[1] * currentScale.current),
        1 / baseScale[2],
      );
    }
  });

  if (length <= 0) {
    return null;
  }

  return (
    <>
      <group ref={groupRef} {...props}>
        <primitive object={clonedScene} />
        <group ref={flameGroupRef} position={[0, 9, 0]}>
          <Flame position={[0, 0, 0]} isLit={isOn} />
        </group>
      </group>
    </>
  );
}

useGLTF.preload("/models/candle/scene.gltf");
export default Candle;
