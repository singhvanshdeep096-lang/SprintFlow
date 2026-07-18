import { forwardRef } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const Input = forwardRef(function Input(
  {
    label,
    error,
    hint,
    icon,
    rightIcon,
    type = 'text',
    size = 'md',
    disabled = false,
    fullWidth = true,
    className = '',
    containerClassName = '',
    required = false,
    ...props
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3.5 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1.5">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={[
            'input-base',
            sizeClasses[size],
            icon ? 'pl-10' : '',
            isPassword || rightIcon ? 'pr-10' : '',
            error ? 'border-danger-500 focus:border-danger-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.1)]' : '',
            disabled ? 'bg-surface-50 cursor-not-allowed opacity-60' : '',
            fullWidth ? 'w-full' : '',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1.5 mt-1.5 text-xs text-danger-600">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-surface-500">{hint}</p>
      )}
    </div>
  );
});

export default Input;
