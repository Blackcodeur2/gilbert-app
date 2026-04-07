import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 13, 26, 0.8)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: '1rem'
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: '500px', backgroundColor: 'var(--color-bg-secondary)',
        padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem',
        maxHeight: '90vh', overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.25rem' }}>{title}</h2>
          <button onClick={onClose} style={{ color: 'var(--color-text-secondary)' }}>
            <X size={20} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component
export function Input({ label, type = 'text', value, onChange, placeholder, required }: any) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value} onChange={onChange} placeholder={placeholder} required={required}
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'white', minHeight: '80px' }}
        />
      ) : (
        <input 
          type={type} value={value} onChange={onChange} placeholder={placeholder} required={required}
          style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-bg-primary)', border: '1px solid var(--color-border)', color: 'white' }}
        />
      )}
    </div>
  );
}

// Reusable Checkbox
export function Checkbox({ label, checked, onChange }: any) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '1rem' }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
      <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{label}</span>
    </label>
  );
}
