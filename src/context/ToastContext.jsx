import { createContext, useContext, useState } from 'react';

const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };

  const success = (msg) => addToast(msg, 'success');
  const error = (msg) => addToast(msg, 'error');

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span>{t.type === 'success' ? '✅' : '❌'}</span>
            <span className="toast-message">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}