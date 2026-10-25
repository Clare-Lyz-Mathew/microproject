import React from 'react';

// Generates an offline-ready, responsive team emblem with team color and initials
export default function TeamCrest({ name = 'Team', tag = 'TM', color = '#00f0ff', size = 30 }) {
  const displayTag = tag ? tag.slice(0, 3).toUpperCase() : name.slice(0, 2).toUpperCase();

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.round(size * 0.2)}px`,
        background: `linear-gradient(135deg, ${color} 0%, rgba(15, 23, 42, 0.9) 100%)`,
        border: `1.5px solid ${color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: `${Math.max(10, Math.round(size * 0.36))}px`,
        letterSpacing: '0.04em',
        boxShadow: `0 2px 10px ${color}33`,
        flexShrink: 0,
        textShadow: '0 1px 3px rgba(0,0,0,0.8)'
      }}
      title={`${name} [${tag}]`}
    >
      {displayTag}
    </div>
  );
}
