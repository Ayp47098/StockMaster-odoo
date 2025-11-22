export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClass = 'btn-brutal'
  const variantClass = {
    primary: 'btn-brutal-primary',
    success: 'btn-brutal-success',
    danger: 'btn-brutal-danger',
    warning: 'btn-brutal-warning',
    secondary: 'btn-brutal-secondary',
    default: ''
  }[variant]

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
