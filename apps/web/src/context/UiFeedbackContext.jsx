/* eslint-disable react/prop-types, react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const UiFeedbackContext = createContext(null);

export const UiFeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const pushToast = (toast) => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, ...toast }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, toast.duration || 3000);
  };

  const value = useMemo(() => ({ toasts, pushToast }), [toasts]);

  return <UiFeedbackContext.Provider value={value}>{children}</UiFeedbackContext.Provider>;
};

export const useUiFeedback = () => {
  const context = useContext(UiFeedbackContext);
  if (!context) throw new Error("useUiFeedback deve ser usado dentro de UiFeedbackProvider");
  return context;
};
