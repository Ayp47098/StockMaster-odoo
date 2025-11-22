export const Loading = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  }

  return (
    <div className="flex justify-center items-center p-8">
      <div className={`${sizes[size]} border-black border-t-transparent rounded-full animate-spin`}></div>
    </div>
  )
}
