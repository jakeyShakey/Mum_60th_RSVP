import { Canvas, useThree } from '@react-three/fiber';
import { useEffect, Suspense } from 'react';
import Lighting from './Lighting';
import CurryModel from './CurryModel';
import Particles from './Particles';
import { SCENE_CONFIG } from '../../utils/constants';

// Helper component to expose camera to parent
function CameraSync({ cameraRef }) {
  const { camera } = useThree();

  useEffect(() => {
    if (cameraRef) {
      cameraRef.current = camera;
    }
  }, [camera, cameraRef]);

  return null;
}

export default function Scene({ onSpinComplete, particleIntensity = 0, cameraRef, onReady }) {
  // Track when Suspense completes and notify parent
  useEffect(() => {
    if (onReady) {
      onReady();
    }
  }, [onReady]);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{
          position: SCENE_CONFIG.camera.position,
          fov: SCENE_CONFIG.camera.fov,
        }}
        dpr={[1, 2]} // Limit pixel ratio for performance
        performance={{ min: 0.5 }} // Dynamic performance scaling
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      >
        {/* Sync camera reference to parent */}
        <CameraSync cameraRef={cameraRef} />

        <Lighting />

        {/* Particle effects */}
        <Particles intensity={particleIntensity} />

        {/* Interactive 3D Curry Model - Wrapped in Suspense */}
        <Suspense fallback={null}>
          <CurryModel
            onSpinComplete={onSpinComplete}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
