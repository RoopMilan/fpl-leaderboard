import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  return open ? (
    <div onClick={() => onOpenChange(false)} style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, right: 0, left: 0, bottom: 0 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ margin: '10% auto', padding: 20, background: '#fff', width: '90%', maxWidth: 500 }}>
        {children}
      </div>
    </div>
  ) : null;
};

export const DialogContent = ({ children }) => <div>{children}</div>;
