import React from 'react';

export function TestAria() {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'linear-gradient(to right, #2563eb, #9333ea)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        zIndex: 99999,
      }}
      onClick={() => alert('ARIA Clicada!')}
    >
      <div style={{ color: 'white', fontSize: '24px' }}>🤖</div>
    </div>
  );
}
