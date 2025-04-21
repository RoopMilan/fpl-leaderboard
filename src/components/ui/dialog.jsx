import React from "react";

export const Dialog = ({ children, open }) => open ? <div>{children}</div> : null;
export const DialogContent = ({ children }) => (
  <div style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "0.5rem" }}>
    {children}
  </div>
);
