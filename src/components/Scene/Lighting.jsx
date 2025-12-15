export default function Lighting() {
  return (
    <>
      {/* Ambient light for overall illumination - increased for brightness */}
      <ambientLight intensity={1.0} />

      {/* Main spotlight on curry - much brighter */}
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={0.5}
        intensity={3.5}
        castShadow={false}
      />

      {/* Fill light from below for atmosphere - brighter warm glow */}
      <pointLight position={[0, -2, 2]} intensity={1.2} color="#ff6b35" />

      {/* Rim light for edge definition - increased */}
      <directionalLight
        position={[-5, 3, -5]}
        intensity={1.5}
        color="#f4a261"
      />
    </>
  );
}
