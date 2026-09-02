/** Three paw prints padding across the screen while we wait. */
export function PawLoader({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center gap-4 text-cream"
      role="status"
      aria-live="polite"
    >
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="animate-bounce text-3xl"
            style={{ animationDelay: `${i * 140}ms` }}
            aria-hidden="true"
          >
            🐾
          </span>
        ))}
      </div>
      <p className="font-heading text-lg font-medium">{label}</p>
    </div>
  );
}
