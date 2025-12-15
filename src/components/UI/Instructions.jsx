import { motion, AnimatePresence } from 'framer-motion';

/**
 * Instructions component - Guides user to spin the curry
 * Fades out once interaction begins
 */
export default function Instructions({ show = true }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
        >
          {/* Main instruction text */}
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-display text-white text-shadow mb-4">
              Spin the curry
            </h2>
            <p className="text-lg text-spice-yellow opacity-80">
              Click and drag to reveal your invitation
            </p>
          </motion.div>

          {/* Animated gesture hint */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mt-8 text-6xl"
          >
            👆
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
