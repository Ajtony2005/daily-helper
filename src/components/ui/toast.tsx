import * as React from "react";

export type ToastProps = {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
};

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "info",
  onClose,
}) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  const color =
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600";

  return (
    <div
      className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-lg text-white font-bold text-lg animate-fade-in ${color}`}
      style={{ minWidth: 220 }}
    >
      {message}
    </div>
  );
};
