import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <motion.div
      key="splash-screen"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020205]"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5, delay: 0.3 }
      }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 blur-[100px] rounded-full opacity-50" />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: 1,
        }}
        exit={{
          scale: 100, // Zoom huge
          opacity: 0,
          transition: { 
              scale: { duration: 0.8, ease: "easeIn" }, 
              opacity: { duration: 0.2, delay: 0.6 } 
          }
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
        // Force GPU Acceleration
        style={{ willChange: "transform", transform: "translateZ(0)" }} 
        className="relative z-10 flex items-center justify-center"
      >
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-primary/40 blur-2xl rounded-full"
        />
        {/* Make sure logo path is correct */}
        <img
          src="/load.png"
          alt="Loading..."
          className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 drop-shadow-2xl"
        />
      </motion.div>
    </motion.div>
  );
}