import { X } from 'lucide-react'

export const Alert = ({ 
  children, 
  variant = 'info', 
  onClose,
  className = '' 
}) => {
  const variantClass = {
    success: 'alert-success',
    danger: 'alert-danger',
    warning: 'alert-warning',
    info: 'alert-info'
  }[variant]

  return (
    <div className={`${variantClass} ${className} flex justify-between items-start`}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 p-1 hover:bg-black hover:bg-opacity-10 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}
