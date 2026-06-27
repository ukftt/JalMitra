const VARIANTS = {
  primary:
    'bg-ink-900 text-white hover:bg-ink-800 shadow-gauge',
  secondary:
    'bg-signal-100 text-signal-600 hover:bg-signal-100/70',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-900/5 border border-ink-900/15',
  danger:
    'bg-alert-600 text-white hover:bg-alert-700',
};
 
export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) {
  const sizeClasses = size === 'sm' ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2.5';
  return (
    <button
      disabled={disabled || loading}
      className={`font-semibold rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${sizeClasses} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}