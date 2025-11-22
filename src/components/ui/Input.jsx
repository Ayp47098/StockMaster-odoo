export const Input = ({ 
  label, 
  error, 
  className = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-bold text-sm uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input 
        className={`input-brutal w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-red-500 text-sm font-bold">{error}</p>
      )}
    </div>
  )
}

export const TextArea = ({ 
  label, 
  error, 
  className = '',
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-bold text-sm uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <textarea 
        className={`input-brutal w-full ${error ? 'border-red-500' : ''} ${className}`}
        rows={4}
        {...props}
      />
      {error && (
        <p className="mt-1 text-red-500 text-sm font-bold">{error}</p>
      )}
    </div>
  )
}

export const Select = ({ 
  label, 
  error, 
  className = '',
  required = false,
  children,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block mb-2 font-bold text-sm uppercase">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select 
        className={`input-brutal w-full ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="mt-1 text-red-500 text-sm font-bold">{error}</p>
      )}
    </div>
  )
}
