export const Menu = ({ items = [] }) => {
  return (
    <div className="ds-menu" role="menu">
      {items.map((item) => (
        <button key={item.label} type="button" role="menuitem" onClick={item.onClick}>
          {item.label}
        </button>
      ))}
    </div>
  );
};
