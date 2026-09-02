import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";

const PIECES = ["🐾", "💚", "🦴", "🐾", "✨", "🐾"];
const COLORS = ["#ff3d7f", "#ffb627", "#29c7e8", "#22d39a", "#ff8a3d"];
const COUNT = 18;

/** mulberry32 — a burst is scattered but derived purely from its seed. */
function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A short burst of paw prints on an adopt. Deliberately cheap: eighteen
 * absolutely positioned spans that unmount as soon as the animation ends.
 */
export function PawConfetti({ fireKey }: { fireKey: number }) {
  const pieces = useMemo(() => {
    const random = seededRandom(fireKey * 2654435761);
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      glyph: PIECES[i % PIECES.length],
      color: COLORS[i % COLORS.length],
      angle: (i / COUNT) * Math.PI * 2 + random() * 0.3,
      distance: 120 + random() * 150,
      scale: 0.7 + random() * 0.8,
      spin: (random() - 0.5) * 420,
    }));
  }, [fireKey]);

  return (
    <AnimatePresence>
      {fireKey > 0 && (
        <div
          key={fireKey}
          className="pointer-events-none absolute inset-0 z-20 grid place-items-center"
          aria-hidden="true"
        >
          {pieces.map((piece) => (
            <motion.span
              key={piece.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.3, rotate: 0 }}
              animate={{
                opacity: 0,
                x: Math.cos(piece.angle) * piece.distance,
                y: Math.sin(piece.angle) * piece.distance,
                scale: piece.scale,
                rotate: piece.spin,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              style={{ color: piece.color }}
              className="absolute text-2xl"
            >
              {piece.glyph}
            </motion.span>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
