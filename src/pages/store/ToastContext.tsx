import { createContext, useState, useContext, ReactNode } from "react";

type Toast = {
  id: string;
  message: string;
  info?: string;
};

interface ToastContextType {
  showToast: (message: string, info?: string) => void;
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

  const showToast = (message: string, info?: string) => {
    const id = generateId();
    setToasts((prevToasts) => [...prevToasts, { id, message, info }]);

    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 flex flex-col gap-3 z-50 tb-toast-2-container-2 tb-container w-72">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            info={toast.info}
            id={toast.id}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast: React.FC<Toast> = ({ message, info }) => {
  return (
    <div className="rounded-lg shadow-lg tb-toast-2">
      <div>
        <strong className="text-base font-semibold">{message}</strong>
      </div>
      {info && <p className="text-sm text-greyishBlue">{info}</p>}
    </div>
  );
};
