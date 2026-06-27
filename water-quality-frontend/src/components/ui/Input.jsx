export function Input({ label, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:outline-none focus:ring-2 focus:ring-signal-500 focus:border-signal-500 transition-shadow bg-white ${className}`}
        {...props}
      />
    </div>
  );
}
 
export function Textarea({ label, className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-xs font-semibold text-ink-700 uppercase tracking-wideish mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full rounded-lg border border-ink-900/15 px-3.5 py-2.5 text-sm text-ink-900 placeholder:text-ink-600/40 focus:outline-none focus:ring-2 focus:ring-signal-500 resize-none transition-shadow bg-white ${className}`}
        {...props}
      />
    </div>
  );
}