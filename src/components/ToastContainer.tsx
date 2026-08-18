import React from 'react';
import { useGetora } from '../context/GetoraContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGetora();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let borderColor = '#1DB954';
        let IconComponent = CheckCircle2;
        let iconColor = '#1DB954';

        if (t.type === 'error') {
          borderColor = '#ff4d4f';
          IconComponent = AlertCircle;
          iconColor = '#ff4d4f';
        } else if (t.type === 'warning') {
          borderColor = '#faad14';
          IconComponent = AlertCircle;
          iconColor = '#faad14';
        } else if (t.type === 'info') {
          borderColor = '#169C46';
          IconComponent = Info;
          iconColor = '#169C46';
        }

        return (
          <div key={t.id} className="toast-item" style={{ borderLeftColor: borderColor }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <IconComponent size={18} color={iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div className="toast-title">{t.title}</div>
                  <div className="toast-desc">{t.message}</div>
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{ color: '#6B6B6B', padding: '2px' }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
