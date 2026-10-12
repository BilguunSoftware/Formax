"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import type { Group, Mesh } from "three";
import type { RefObject } from "react";

type Mouse = { x: number; y: number };

export function CameraRig({ mouse }: { mouse: RefObject<Mouse> }) {
  const { camera } = useThree();
  useFrame(() => {
    const targetX = 2.05 + mouse.current.x * 0.9;
    const targetY = 1.05 - mouse.current.y * 0.55;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.lookAt(0, -0.08, 0);
  });
  return null;
}

export function FloatingGeometry({ mouse }: { mouse: RefObject<Mouse> }) {
  const group = useRef<Group>(null);
  const glass = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const current = group.current;
    if (!current) return;
    const px = mouse.current.x;
    const py = mouse.current.y;
    current.rotation.y += delta * 0.16;
    current.rotation.x += (py * 0.32 - current.rotation.x) * 0.06;
    current.rotation.z += (px * -0.14 - current.rotation.z) * 0.06;
    current.position.x += (px * 0.42 - current.position.x) * 0.07;
    current.position.y += (py * -0.22 - current.position.y) * 0.07;
    if (glass.current) {
      glass.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group ref={group}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.15, 0]}>
        <circleGeometry args={[2.4, 48]} />
        <meshStandardMaterial color="#101410" metalness={0.6} roughness={0.42} />
      </mesh>
      <mesh position={[0.05, -0.78, 0.05]} rotation={[0, 0.45, 0]}>
        <boxGeometry args={[2.35, 0.14, 1.55]} />
        <meshStandardMaterial color="#243028" metalness={0.55} roughness={0.32} />
        <Edges color="#D7FA65" threshold={15} />
      </mesh>
      <mesh position={[-0.22, -0.28, 0.2]} rotation={[0, -0.25, 0]}>
        <boxGeometry args={[1.7, 0.16, 1.2]} />
        <meshStandardMaterial color="#1b241d" metalness={0.62} roughness={0.28} />
        <Edges color="#F2F0E7" threshold={15} />
      </mesh>
      <mesh position={[0.28, 0.22, -0.12]}>
        <boxGeometry args={[1.25, 0.18, 1.05]} />
        <meshStandardMaterial color="#314036" metalness={0.45} roughness={0.38} />
      </mesh>
      <mesh position={[-0.72, 0.02, 0.18]}>
        <boxGeometry args={[0.14, 1.45, 0.14]} />
        <meshStandardMaterial color="#d7fa65" metalness={0.25} roughness={0.3} />
      </mesh>
      <mesh ref={glass} position={[0.95, 0.15, 0.35]} rotation={[0.08, 0.4, 0.04]}>
        <boxGeometry args={[0.06, 1.7, 0.95]} />
        <meshStandardMaterial
          color="#f2f0e7"
          metalness={0.15}
          roughness={0.08}
          transparent
          opacity={0.28}
        />
      </mesh>
      <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.55}>
        <mesh position={[0.05, 0.42, 0]}>
          <boxGeometry args={[1.45, 1.45, 1.45]} />
          <meshBasicMaterial transparent opacity={0.03} color="#d7fa65" />
          <Edges color="#D7FA65" />
        </mesh>
      </Float>
    </group>
  );
}

export function CssArchitectureMark() {
  return (
    <div className="relative size-full" aria-hidden>
      <div className="spin-slow absolute inset-[6%] border border-lime/80" />
      <div className="absolute inset-[18%] rotate-12 border border-paper/40" />
      <div className="absolute inset-[34%] -rotate-6 border border-paper/25" />
      <div className="absolute inset-[42%] bg-lime/85" />
    </div>
  );
}
