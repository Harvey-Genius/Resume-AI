/**
 * Reusable Button component with multiple variants
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'ghost' | 'outline'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.loading - Loading state
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ElementType} props.as - Render as different element (e.g., 'a', Link)
 * @returns {JSX.Element}
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  children,
  as: Component = 'button',
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    rounded-lg transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `

  const variants = {
    primary: `
      bg-primary-600 text-white
      hover:bg-primary-700 active:bg-primary-800
      focus-visible:ring-primary-500
      shadow-sm hover:shadow-md
    `,
    secondary: `
      bg-stone-100 text-stone-900
      hover:bg-stone-200 active:bg-stone-300
      focus-visible:ring-stone-500
    `,
    ghost: `
      bg-transparent text-stone-700
      hover:bg-stone-100 active:bg-stone-200
      focus-visible:ring-stone-500
    `,
    outline: `
      bg-white text-stone-700 border border-stone-300
      hover:bg-stone-50 hover:border-stone-400
      active:bg-stone-100
      focus-visible:ring-stone-500
    `,
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  const combinedClassName = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `.replace(/\s+/g, ' ').trim()

  return (
    <Component
      className={combinedClassName}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </Component>
  )
}

export default Button
