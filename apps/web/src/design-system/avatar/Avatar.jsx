export const Avatar = ({ src, alt = "", size = 40, className = "" }) => {
  return <img src={src} alt={alt} width={size} height={size} className={`ds-avatar ${className}`.trim()} />;
};
