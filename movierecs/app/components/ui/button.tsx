import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'default', asChild, children, ...props }) => {
  const Component = asChild ? React.Fragment : 'button';
  const className = variant === 'outline' ? 'border border-gray-500 text-gray-500' : 'bg-blue-500 text-white';

  return (
    <Component className={`py-2 px-4 rounded ${className}`} {...props}>
      {children}
    </Component>
  );
};

export default Button;
