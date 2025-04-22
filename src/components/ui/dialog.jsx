export function Dialog({ open, children }) {
  if (!open) return null;
  return <div className="dialog">{children}</div>;
}

export function DialogContent({ children }) {
  return <div className="dialog-content">{children}</div>;
}