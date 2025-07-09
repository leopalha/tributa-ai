import React from 'react';
import { Button as ButtonComponent, ButtonProps } from '@/components/ui/button';

/**
 * A button component that ensures the type attribute is always set.
 * This prevents the 'Button type attribute has not been set' warning.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', ...props }, ref) => {
    return <ButtonComponent type={type} {...props} ref={ref} />;
  }
);
Button.displayName = 'Button';

/**
 * A component that can be used to fix button-like anchors in the application.
 * This is important for accessibility.
 */
export const ButtonLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: string; size?: string }
>(({ children, ...props }, ref) => {
  return (
    <a ref={ref} role="button" tabIndex={0} {...props}>
      {children}
    </a>
  );
});
ButtonLink.displayName = 'ButtonLink';

export default Button;
