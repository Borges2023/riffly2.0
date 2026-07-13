export const Dialog = ({ open, title, description, actions, onClose }) => {
  if (!open) return null;
  return (
    <div className="ds-dialog__backdrop">
      <div className="ds-dialog" role="alertdialog" aria-modal="true" aria-labelledby="dialog-title">
        <h3 id="dialog-title">{title}</h3>
        {description ? <p>{description}</p> : null}
        <div className="ds-dialog__actions">
          {actions}
          {onClose ? <button type="button" onClick={onClose}>Fechar</button> : null}
        </div>
      </div>
    </div>
  );
};
