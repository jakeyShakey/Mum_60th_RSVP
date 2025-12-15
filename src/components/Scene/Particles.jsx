import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PERFORMANCE, COLORS } from '../../utils/constants';

/**
 * Particles component - Steam/spice particles that respond to spin progress
 */
export default function Particles({ intensity = 0 }) {
  const particlesRef = useRef();

  // Get particle count based on device
  const particleCount = PERFORMANCE.getParticleCount();

  // Generate particle positions
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a sphere around the curry
      const radius = 1 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 0.5;
      positions[i3 + 2] = radius * Math.cos(phi);

      // Mix of warm colors (orange, gold, red)
      const colorChoice = Math.random();
      let color;

      if (colorChoice < 0.4) {
        color = new THREE.Color(COLORS.particles.spice); // Orange
      } else if (colorChoice < 0.7) {
        color = new THREE.Color(COLORS.particles.gold); // Gold
      } else {
        color = new THREE.Color(COLORS.particles.steam); // White
      }

      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, [particleCount]);

  // Animate particles
  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.elapsedTime;
    const positions = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Gentle floating motion
      positions[i3 + 1] += Math.sin(time + i) * 0.001 * intensity;

      // Subtle rotation around Y axis
      const angle = 0.001 * intensity;
      const x = positions[i3];
      const z = positions[i3 + 2];
      positions[i3] = x * Math.cos(angle) - z * Math.sin(angle);
      positions[i3 + 2] = x * Math.sin(angle) + z * Math.cos(angle);

      // Reset particles that go too far
      if (positions[i3 + 1] > 2) {
        positions[i3 + 1] = -1;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Adjust opacity based on intensity
    if (particlesRef.current.material) {
      particlesRef.current.material.opacity = Math.min(intensity * 0.8, 0.6);
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
