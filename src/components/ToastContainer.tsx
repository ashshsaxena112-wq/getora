import React from 'react';
import { useGetora } from '../context/GetoraContext';
import { IconCircleCheck, IconAlertCircle, IconInfoCircle, IconX } from '@tabler/icons-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useGetora();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => {
        let borderColor = '#22C55E';
        let IconComponent = IconCircleCheck;
        let iconColor = '#22C55E';

        if (t.type === 'error') {
          borderColor = '#EF4444';
          IconComponent = IconAlertCircle;
          iconColor = '#EF4444';
        } else if (t.type === 'warning') {
          borderColor = '#F59E0B';
          IconComponent = IconAlertCircle;
          iconColor = '#F59E0B';
        } else if (t.type === 'info') {
          borderColor = '#22C55E';
          IconComponent = IconInfoCircle;
          iconColor = '#22C55E';
        }

        return (
          <div key={t.id} className="toast-item" style={{ borderLeftColor: borderColor }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <IconComponent size={18} stroke={1.8} color={iconColor} style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div className="toast-title">{t.title}</div>
                  <div className="toast-desc">{t.message}</div>
                </div>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{ color: 'var(--text-muted)', padding: '2px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <IconX size={15} stroke={1.8} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
