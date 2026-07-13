export const Sidebar = ({ title, children }) => {
  return (
    <aside className="ds-sidebar">
      <h3>{title}</h3>
      {children}
    </aside>
  );
};
