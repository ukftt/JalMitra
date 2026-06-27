export default function Card({ className = '', children, ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-ink-900/8 shadow-gauge ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}