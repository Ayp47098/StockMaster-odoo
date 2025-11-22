import { X } from 'lucide-react'
import { Button } from './Button'

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer,
  size = 'md'
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  }

  return (
    <div className="modal-overlay fade-in" onClick={onClose}>
      <div 
        className={`modal-brutal slide-in-right ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold uppercase">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 border-2 border-black transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          {children}
        </div>
        
        {footer && (
          <div className="flex justify-end gap-3 pt-4 border-t-3 border-black">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
