export const Toast = ({ title, description, tone = "info", onClose }) => {
  return (
    <div className={`ds-toast ds-toast--${tone}`}>
      <div>
        <strong>{title}</strong>
        {description ? <p>{description}</p> : null}
      </div>
      {onClose ? <button type="button" onClick={onClose}>Fechar</button> : null}
    </div>
  );
};
