import { useGLTF } from '@react-three/drei';
import { useState, useEffect } from 'react';

/**
 * Custom hook to load a GLTF/GLB model with progress tracking
 * @param {string} path - Path to the GLB file
 * @returns {Object} - Model data and loading state
 */
export function useGLTFModel(path) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate progress for now - in production, use a proper loader with progress events
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  try {
    const model = useGLTF(path);

    useEffect(() => {
      if (model && progress === 100) {
        setIsLoading(false);
      }
    }, [model, progress]);

    return { model, progress, isLoading, error };
  } catch (err) {
    setError(err.message || 'Failed to load 3D model');
    setIsLoading(false);
    return { model: null, progress: 100, isLoading: false, error };
  }
}

// Preload the model
export function preloadModel(path) {
  useGLTF.preload(path);
}
