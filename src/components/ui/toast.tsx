import * as React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export type ToastProps = {
  id?: string; // Új prop a toast azonosításához több toast esetén
  message: string;
  type?: "success" | "error" | "info";
  icon?: React.ReactNode; // Testreszabható ikon
  onClose?: () => void;
  duration?: number;
};

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = "info",
  icon,
  onClose,
  duration = 2000,
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300);
      }
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: {
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      defaultIcon: <span className="text-xl">✅</span>,
    },
    error: {
      color: "bg-gradient-to-r from-red-500 to-rose-500",
      defaultIcon: <span className="text-xl">❌</span>,
    },
    info: {
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      defaultIcon: <span className="text-xl">ℹ️</span>,
    },
  };

  const { color, defaultIcon } = styles[type];
  const displayIcon = icon || defaultIcon;

  const toastVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <>
      {isVisible && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={toastVariants}
          className={`rounded-xl shadow-glass backdrop-blur-xl border border-white/20 p-4 text-white font-semibold text-base max-w-sm w-full ${color}`}
          style={{ marginBottom: "1rem" }}
        >
          <div className="flex items-center gap-3">
            {displayIcon && <div className="flex-shrink-0">{displayIcon}</div>}
            <div className="flex-1">{message}</div>
            <button
              onClick={() => {
                setIsVisible(false);
                if (onClose) onClose();
              }}
              className="p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label="Close toast"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
};

// ToastContainer for stacking multiple toasts at top right
export const ToastContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="fixed top-6 right-6 z-[9999] flex flex-col items-end gap-4">
    {children}
  </div>
);
