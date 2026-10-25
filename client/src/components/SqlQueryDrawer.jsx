import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

export default function SqlQueryDrawer({ title = "Active SQL JOIN Query", sql, explanation }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!sql) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      marginTop: '2rem',
      background: 'rgba(15, 19, 34, 0.95)',
      border: '1px solid rgba(10, 200, 185, 0.3)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
    }}>
      <div 
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.25rem',
          cursor: 'pointer',
          background: 'rgba(10, 200, 185, 0.08)',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Database size={18} color="var(--hextech-cyan)" />
          <div>
            <span className="font-tech" style={{ fontSize: '0.9rem', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {title}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.75rem' }}>
              (Click to {open ? 'collapse' : 'view relational JOIN'} syntax)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--hextech-cyan)' }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {open && (
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(10, 200, 185, 0.15)' }}>
          {explanation && (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              💡 {explanation}
            </p>
          )}

          <div style={{ position: 'relative' }}>
            <button
              onClick={handleCopy}
              className="btn btn-secondary btn-sm"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '0.25rem 0.6rem',
                fontSize: '0.75rem',
                zIndex: 2
              }}
            >
              {copied ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy SQL'}</span>
            </button>

            <pre className="sql-box">{sql}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
