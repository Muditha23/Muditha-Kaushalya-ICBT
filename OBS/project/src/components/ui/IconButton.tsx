import React from 'react';

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'blue' | 'red' | 'green';
  disabled?: boolean;
  loading?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  label,
  variant = 'primary',
  size = 'md',
  color = 'default',
  disabled = false,
  loading = false,
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-black bg-opacity-50 hover:bg-opacity-70',
    secondary: 'bg-gray-800 bg-opacity-70 hover:bg-opacity-90',
    ghost: 'bg-transparent hover:bg-gray-800 hover:bg-opacity-30',
  };
  
  // Color classes
  const colorClasses = {
    default: 'text-white',
    blue: 'text-blue-400',
    red: 'text-red-400',
    green: 'text-green-400',
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={label}
      title={label}
      className={`
        rounded-full flex items-center justify-center transition-all duration-200
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${colorClasses[color]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${loading ? 'animate-pulse' : ''}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      ) : (
        icon
      )}
    </button>
  );
};

export default IconButton;