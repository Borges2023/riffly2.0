import { forwardRef } from "react";

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className = "", as: Component = "button", ...props },
  ref
) {
  return <Component ref={ref} className={`ds-button ds-button--${variant} ds-button--${size} ${className}`.trim()} {...props} />;
});
