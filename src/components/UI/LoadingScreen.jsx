import { motion } from 'framer-motion';

/**
 * LoadingScreen component - Shows loading progress while 3D assets load
 */
export default function LoadingScreen({ progress = 0 }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-display text-white text-shadow">
          Loading...
        </h2>
      </motion.div>

      {/* Progress bar container */}
      <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
        {/* Progress bar fill */}
        <motion.div
          className="h-full bg-gradient-to-r from-spice-yellow via-spice-orange to-spice-red"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>

      {/* Percentage text */}
      <motion.p
        className="mt-4 text-spice-yellow text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {Math.round(progress)}%
      </motion.p>

      {/* Decorative curry emoji (optional) */}
      <motion.div
        className="mt-8 text-6xl"
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        🍛
      </motion.div>
    </div>
  );
}
