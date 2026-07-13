import { Toast } from "../../design-system/index.js";
import { useUiFeedback } from "../../context/UiFeedbackContext.jsx";

export const ToastViewport = () => {
  const { toasts } = useUiFeedback();

  return (
    <div className="ds-toast-viewport">
      {toasts.map((toast) => (
        <Toast key={toast.id} title={toast.title} description={toast.description} tone={toast.tone} />
      ))}
    </div>
  );
};
