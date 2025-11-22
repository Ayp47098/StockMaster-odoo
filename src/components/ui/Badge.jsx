export const Badge = ({ children, variant = 'info', className = '' }) => {
  const variantClass = {
    success: 'badge-success',
    danger: 'badge-danger',
    warning: 'badge-warning',
    info: 'badge-info'
  }[variant]

  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  )
}
