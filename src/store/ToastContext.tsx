import { createContext, useState, useContext, ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Toast = {
  id: string;
  message: string;
  info?: string;
  type: "normal" | "error";
};

interface ToastContextType {
  showToast: (
    message: string,
    info?: string,
    type?: "normal" | "error"
  ) => void;
  showErrorToast: (message: string, info?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showToast = (
    message: string,
    info?: string,
    type: "normal" | "error" = "normal"
  ) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { id, message, info, type }]);

    setTimeout(() => removeToast(id), 4000);
  };

  const showErrorToast = (message: string, info?: string) => {
    const { showToast } = useToast();
    showToast(message, info);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, showErrorToast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50 tb-toast-2-container-2 w-72">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              info={toast.info}
              id={toast.id}
              type={toast.type}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<Toast> = ({ message, info, type }) => {
  return (
    <motion.div
      initial={{ opacity: 1, x: 320 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: 320, y: -100 }}
      transition={{ ease: "easeOut", duration: 0 }}
      className={`rounded-lg shadow-lg tb-toast-2 ${type === "error" ? "bg-red-700" : ""}`}
    >
      <div>
        <strong className="text-base font-semibold">{message}</strong>
      </div>
      {info && <p className="text-sm text-greyishBlue">{info}</p>}
    </motion.div>
  );
};
