import React from 'react';

interface GetoraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
}

export const GetoraLogo: React.FC<GetoraLogoProps> = ({ size = 'md', showBadge = false }) => {
  const iconSize = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;
  const fontSize = size === 'sm' ? '18px' : size === 'lg' ? '26px' : '21px';

  return (
    <div className="getora-logo-wrap" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', userSelect: 'none' }}>
      {/* Brand Icon Emblem */}
      <div
        className="getora-logo-emblem"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
          borderRadius: size === 'sm' ? '8px' : '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.25s ease'
        }}
      >
        <svg
          viewBox="0 0 100 100"
          style={{ width: '80%', height: '80%' }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M72 32H38C30.268 32 24 38.268 24 46V54C24 61.732 30.268 68 38 68H64C71.732 68 78 61.732 78 54V48H52"
            fill="none"
            stroke="#1DB954"
            strokeWidth="11"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="70" cy="32" r="5" fill="#1DB954" />
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <div
          className="getora-logo-text"
          style={{
            fontFamily: 'Outfit, Inter, sans-serif',
            fontWeight: 900,
            fontSize,
            letterSpacing: '0.04em',
            display: 'flex',
            alignItems: 'center',
            gap: '1px'
          }}
        >
          <span className="getora-word-first">GET</span>
          <span className="getora-word-accent">ORA</span>
        </div>
      </div>

      {showBadge && (
        <span className="brand-badge-desktop">HYPERLOCAL</span>
      )}
    </div>
  );
};
