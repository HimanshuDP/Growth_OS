export default function LoadingSpinner({ size = 'md', text }: { size?: 'sm' | 'md' | 'lg'; text?: string }) {
  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-4 h-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="flex items-center gap-2">
        <div className={`${dotSize[size]} rounded-full bg-brand-orange dot-pulse [animation-delay:-0.3s]`} />
        <div className={`${dotSize[size]} rounded-full bg-brand-orange dot-pulse [animation-delay:-0.15s]`} />
        <div className={`${dotSize[size]} rounded-full bg-brand-orange dot-pulse`} />
      </div>
      {text && (
        <p className="text-sm font-medium text-text-muted uppercase tracking-widest animate-pulse">{text}</p>
      )}
    </div>
  );
}
