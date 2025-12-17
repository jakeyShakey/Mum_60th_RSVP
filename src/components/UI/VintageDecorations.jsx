/**
 * Vintage 1960s Decorative Elements
 * SVG and styled components for retro ornaments
 */

// Giant "60" Background Watermark
export function GiantSixtyBackground({ className = '' }) {
  return (
    <div
      className={`giant-sixty absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}
      style={{
        zIndex: 0,
        opacity: 0,
      }}
    >
      <span
        className="font-number text-gradient-gold select-none"
        style={{
          fontSize: 'clamp(250px, 30vw, 400px)',
          lineHeight: '1',
          fontWeight: 'bold',
        }}
      >
        60
      </span>
    </div>
  );
}

// Border Frame Component
export function BorderFrame({ className = '' }) {
  return (
    <div
      className={`border-frame absolute pointer-events-none ${className}`}
      style={{
        inset: '10px',
        border: '4px double #E9C46A',
        borderRadius: '4px',
        boxShadow: 'inset 0 0 20px rgba(233, 196, 106, 0.2)',
        zIndex: 2,
        opacity: 0,
      }}
    />
  );
}

// Horizontal Divider Ornament
export function DividerOrnament({ className = '' }) {
  return (
    <svg
      className={`divider-ornament w-48 h-6 mx-auto ${className}`}
      viewBox="0 0 200 20"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity: 0 }}
    >
      {/* Left line */}
      <line x1="0" y1="10" x2="70" y2="10" stroke="#E9C46A" strokeWidth="2" />

      {/* Center diamond */}
      <rect
        x="95"
        y="5"
        width="10"
        height="10"
        fill="#FF6B35"
        transform="rotate(45 100 10)"
      />

      {/* Right line */}
      <line x1="130" y1="10" x2="200" y2="10" stroke="#E9C46A" strokeWidth="2" />

      {/* Decorative dots */}
      <circle cx="75" cy="10" r="2" fill="#E9C46A" />
      <circle cx="80" cy="10" r="2" fill="#E9C46A" />
      <circle cx="120" cy="10" r="2" fill="#E9C46A" />
      <circle cx="125" cy="10" r="2" fill="#E9C46A" />
    </svg>
  );
}
