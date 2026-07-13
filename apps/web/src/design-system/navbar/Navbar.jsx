import { Link } from "react-router-dom";

export const Navbar = ({ brand, items = [], rightSlot = null }) => {
  return (
    <nav className="ds-navbar">
      <Link to="/" className="ds-navbar__brand">{brand}</Link>
      <div className="ds-navbar__items">
        {items.map((item) => (
          <Link key={item.to} to={item.to}>{item.label}</Link>
        ))}
      </div>
      {rightSlot}
    </nav>
  );
};
