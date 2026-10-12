"use client";

import { Component, type ReactNode, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { CameraRig, CssArchitectureMark, FloatingGeometry } from "@/components/three/FloatingGeometry";

type Mouse = { x: number; y: number };

class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

type ArchitectureSceneProps = {
  mouse: RefObject<Mouse>;
  active: boolean;
};

export default function ArchitectureScene({ mouse, active }: ArchitectureSceneProps) {
  return (
    <WebGLBoundary fallback={<CssArchitectureMark />}>
      <Canvas
        className="h-full w-full"
        camera={{ position: [2.15, 1.05, 3.4], fov: 32 }}
        dpr={[1, 1.4]}
        frameloop={active ? "always" : "never"}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={0.42} />
        <directionalLight position={[4.2, 5.4, 2.4]} intensity={2.1} color="#F2F0E7" />
        <directionalLight position={[-3.4, 1.2, -2.2]} intensity={1.15} color="#D7FA65" />
        <pointLight position={[0.2, 0.4, 1.6]} intensity={1.4} color="#D7FA65" distance={6} />
        <CameraRig mouse={mouse} />
        <FloatingGeometry mouse={mouse} />
      </Canvas>
    </WebGLBoundary>
  );
}
