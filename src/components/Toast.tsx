import { motion, AnimatePresence } from "motion/react";
import { Check } from "lucide-react";
import { createPortal } from "react-dom";

interface ToastProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

export default function Toast({ isVisible, message, onClose }: ToastProps) {
  return createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 px-8 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4">
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/40">
              <Check className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-white text-[15px] font-display font-bold tracking-tight">
              {message}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
