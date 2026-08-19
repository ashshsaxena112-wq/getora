import React from 'react';
import { useGetora } from '../context/GetoraContext';

interface GetoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  className?: string;
}

export const GetoraLogo: React.FC<GetoraLogoProps> = ({
  size = 'md',
  showBadge = false,
  className = ''
}) => {
  const { resolvedTheme } = useGetora();

  // Consistent sizing across themes so no layout shift happens
  const dimensions =
    size === 'sm'
      ? { width: 110, height: 32, radius: 7 }
      : size === 'lg'
      ? { width: 156, height: 46, radius: 10 }
      : { width: 130, height: 38, radius: 8 };

  const isLight = resolvedTheme === 'light';

  return (
    <div
      className={`getora-logo-container ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        userSelect: 'none',
        verticalAlign: 'middle'
      }}
    >
      <div
        className="getora-logo-image-box"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          borderRadius: `${dimensions.radius}px`,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
          transition: 'box-shadow 0.2s ease'
        }}
      >
        {/* Dark Theme Logo (Black background with Green text) */}
        <img
          src="/assets/logo-dark.png"
          alt="GETORA"
          className="getora-theme-logo-dark"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.22)',
            display: isLight ? 'none' : 'block'
          }}
          loading="eager"
        />

        {/* Light Theme Logo (Green background with White text) */}
        <img
          src="/assets/logo-light.png"
          alt="GETORA"
          className="getora-theme-logo-light"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.22)',
            display: isLight ? 'block' : 'none'
          }}
          loading="eager"
        />
      </div>

      {showBadge && (
        <span className="brand-badge-desktop">HYPERLOCAL</span>
      )}
    </div>
  );
};
