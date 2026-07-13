export const Card = ({ className = "", ...props }) => {
  return <div className={`ds-card ${className}`.trim()} {...props} />;
};
