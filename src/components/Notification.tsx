import React, { createContext, useContext, useState, useCallback } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface NotificationContextType {
  showNotification: (message: string, type: Notification['type']) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider');
  return ctx;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((message: string, type: Notification['type']) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3000);
  }, []);

  const getStyles = (type: Notification['type']) => {
    switch(type) {
      case 'success': return { background: 'var(--success-container)', color: 'var(--success)' };
      case 'error': return { background: 'var(--error-container)', color: 'var(--error)' };
      case 'warning': return { background: 'var(--warning-container)', color: 'var(--warning)' };
      default: return { background: 'var(--primary-container)', color: 'var(--primary)' };
    }
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed bottom-20 right-4 z-50 flex flex-col gap-2">
        {notifications.map(n => (
          <div key={n.id} className="px-4 py-3 rounded-lg shadow-lg animate-slide-up" style={{...getStyles(n.type), minWidth: '200px'}}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};