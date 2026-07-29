import { forwardRef, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import './Input.css';

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
  const inputType  = isPassword ? (showPassword ? 'text' : 'password') : type;

  const sizeClass = { sm: 'input--sm', md: 'input--md', lg: 'input--lg' }[size] || 'input--md';

  return (
    <div
      className={[
        'input-wrap',
        fullWidth ? 'input-wrap--full' : '',
        containerClassName,
      ].filter(Boolean).join(' ')}
    >
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}

      <div className="input-field-wrap">
        {icon && (
          <div className="input-icon-left">{icon}</div>
        )}

        <input
          ref={ref}
          type={inputType}
          disabled={disabled}
          className={[
            'input-base',
            sizeClass,
            icon                     ? 'input--has-left'  : '',
            isPassword || rightIcon  ? 'input--has-right' : '',
            error                    ? 'input--error'     : '',
            fullWidth                ? 'input-wrap--full' : '',
            className,
          ].filter(Boolean).join(' ')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="input-pw-toggle"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {rightIcon && !isPassword && (
          <div className="input-icon-right">{rightIcon}</div>
        )}
      </div>

      {error && (
        <p className="input-error-msg">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="input-hint">{hint}</p>
      )}
    </div>
  );
});

export default Input;
