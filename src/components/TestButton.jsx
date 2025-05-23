import React from 'react';

export default function TestButton() {
  return (
    <button
      onClick={() => alert('React works!')}
      style={{ padding: '0.5rem 1rem', borderRadius: '0.5rem', background: '#6366f1', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
    >
      Test React Button
    </button>
  );
} 