import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import gsap from 'gsap';
import { SCENE_CONFIG } from '../../utils/constants';
import { createClickSpinTimeline } from '../../utils/animations';
import { useSound } from '../../hooks/useSound';
import { useAudioManager } from '../../hooks/useAudioManager';

/**
 * CurryModel component - Interactive 3D curry with spin mechanic
 */
function CurryModel({
  modelPath = '/models/curry.glb',
  onSpinComplete
}) {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExploding, setIsExploding] = useState(false);
  const materialsRef = useRef([]); // Cache materials for performance
  const explosionStartTime = useRef(0);
  const spinTimelineRef = useRef(null);
  const lastSizzleTime = useRef(0); // Throttle hover sizzle sound

  const { gl } = useThree();

  // Audio management
  const { getEffectiveVolume } = useAudioManager();

  // Spin sound effects
  const spinWhoosh = useSound({
    src: '/audio/spin-whoosh.mp3',
    volume: getEffectiveVolume(0.6),
    preload: true,
  });

  const spinSizzle = useSound({
    src: '/audio/spin-sizzle.mp3',
    volume: getEffectiveVolume(0.6),
    preload: true,
  });

  const explosionSound = useSound({
    src: '/audio/explosion-reveal.mp3',
    volume: getEffectiveVolume(0.8),
    preload: true,
  });

  // Load the 3D model (Suspense handles loading state)
  const model = useGLTF(modelPath);

  // Enable pointer events on all meshes in the model
  useEffect(() => {
    if (model && groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh) {
          child.userData.draggable = true;
        }
      });
    }
  }, [model]);

  // Update cursor style based on hover state (pointer instead of grab)
  useEffect(() => {
    if (gl.domElement) {
      gl.domElement.style.cursor = isHovered && !hasClicked ? 'pointer' : 'default';
    }
  }, [isHovered, hasClicked, gl.domElement]);

  // Click handler - triggers automated spin animation
  const handleClick = useCallback(() => {
    if (hasClicked || isAnimating) return; // One-time only

    setHasClicked(true);
    setIsAnimating(true);

    // Play whoosh sound
    spinWhoosh.play();

    // Create and play GSAP spin animation
    const timeline = createClickSpinTimeline({
      curryGroup: groupRef.current,
      onComplete: () => {
        setIsAnimating(false);
        setIsExploding(true);
        explosionStartTime.current = Date.now();
        explosionSound.play();

        if (onSpinComplete) {
          onSpinComplete();
        }
      },
      duration: 5.0, // 5 seconds - slow, dramatic
    });

    spinTimelineRef.current = timeline;
  }, [hasClicked, isAnimating, spinWhoosh, explosionSound, onSpinComplete]);

  // Hover handler - plays sizzle sound (throttled)
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);

    // Play sizzle sound (throttled to once per second)
    if (!hasClicked) {
      const now = Date.now();
      if (now - lastSizzleTime.current > 1000) {
        spinSizzle.play();
        lastSizzleTime.current = now;
      }
    }
  }, [hasClicked, spinSizzle]);

  // Cache materials when explosion starts
  useEffect(() => {
    if (isExploding && groupRef.current && materialsRef.current.length === 0) {
      const materials = [];
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.transparent = true;
          if (child.material.opacity === undefined) {
            child.material.opacity = 1;
          }
          materials.push(child.material);
        }
      });
      materialsRef.current = materials;
    }
  }, [isExploding]);

  // Idle pulse animation - indicates clickability
  useEffect(() => {
    if (hasClicked || !groupRef.current) return;

    // Subtle pulsing scale to indicate curry is interactive
    const pulse = gsap.to(groupRef.current.scale, {
      x: 1.05,
      y: 1.05,
      z: 1.05,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      pulse.kill();
      if (groupRef.current) {
        gsap.set(groupRef.current.scale, { x: 1, y: 1, z: 1 });
      }
    };
  }, [hasClicked]);

  // useFrame for explosion effect and hover bounce
  useFrame(() => {
    if (!groupRef.current) return;

    // Explosion effect - fade out and continue scaling
    if (isExploding) {
      const elapsedTime = (Date.now() - explosionStartTime.current) / 1000; // seconds
      const explosionDuration = 0.8; // Shorter, snappier explosion

      if (elapsedTime < explosionDuration) {
        // Continue scaling from where we left off (2.0) up to 3.5
        const scaleProgress = elapsedTime / explosionDuration;
        const scale = 2.0 + scaleProgress * 1.5; // Scale from 2.0 to 3.5
        groupRef.current.scale.set(scale, scale, scale);

        // Fade out quickly using cached materials (no traversal!)
        const fadeProgress = elapsedTime / explosionDuration;
        materialsRef.current.forEach((material) => {
          material.opacity = 1 - fadeProgress;
        });
      } else {
        // Explosion complete - hide the curry completely
        groupRef.current.visible = false;
      }
    } else {
      // Add subtle bounce effect when hovering (only when not clicked and not animating)
      if (isHovered && !hasClicked && !isAnimating) {
        groupRef.current.position.y = Math.sin(Date.now() * 0.002) * 0.05;
      } else {
        groupRef.current.position.y = 0;
      }
    }
  });

  // Interaction props - click to spin, hover for sizzle
  const interactionProps = {
    onClick: handleClick,
    onPointerEnter: handlePointerEnter,
    onPointerLeave: () => setIsHovered(false),
  };

  // Cache the cloned model to prevent re-cloning on every render
  const clonedModel = useMemo(() => {
    return model?.scene ? model.scene.clone() : null;
  }, [model]);

  // Render the curry model wrapped in a group
  return (
    <group
      ref={groupRef}
      position={SCENE_CONFIG.model.position}
      scale={SCENE_CONFIG.model.scale}
      {...interactionProps}
    >
      <primitive object={clonedModel} />
    </group>
  );
}

// Export with React.memo to prevent unnecessary re-renders
export default React.memo(CurryModel);
