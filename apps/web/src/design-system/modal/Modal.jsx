export const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;

  return (
    <div className="ds-modal__backdrop" onClick={onClose} role="presentation">
      <div className="ds-modal" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <header className="ds-modal__header">
          <h3>{title}</h3>
          <button type="button" onClick={onClose}>×</button>
        </header>
        <div className="ds-modal__body">{children}</div>
      </div>
    </div>
  );
};
