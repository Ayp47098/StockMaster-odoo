export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div 
      className={`${hover ? 'card-brutal-hover' : 'card-brutal'} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
