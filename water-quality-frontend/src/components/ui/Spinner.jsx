export default function Spinner({ size = 'md', className = '' }) {
  const px = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
  return (
    <span
      className={`${px} border-2 border-ink-700 border-t-transparent rounded-full animate-spin inline-block ${className}`}
    />
  );
}