import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useState } from "react";
import type { Pet, SwipeDirection } from "@shared/pets";
import { SPECIES_EMOJI } from "@/features/swipe/species";

/** Horizontal travel, in px, that commits a swipe on release. */
const COMMIT_DISTANCE = 110;
/** A fast flick commits even if it hasn't travelled far. */
const COMMIT_VELOCITY = 500;

interface PetCardProps {
  pet: Pet;
  /** Set to fly the card off-screen from a button or arrow key. */
  flingTo: SwipeDirection | null;
  onCommit: (direction: SwipeDirection) => void;
  onDragDirectionChange: (direction: SwipeDirection | null) => void;
}

export function PetCard({
  pet,
  flingTo,
  onCommit,
  onDragDirectionChange,
}: PetCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 0, 260], [-16, 0, 16]);
  const adoptOpacity = useTransform(x, [30, 130], [0, 1]);
  const nopeOpacity = useTransform(x, [-130, -30], [1, 0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  useMotionValueEvent(x, "change", (latest) => {
    onDragDirectionChange(
      Math.abs(latest) < 24 ? null : latest > 0 ? "adopt" : "pass",
    );
  });

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const committed =
      Math.abs(info.offset.x) > COMMIT_DISTANCE ||
      Math.abs(info.velocity.x) > COMMIT_VELOCITY;

    if (!committed) {
      onDragDirectionChange(null);
      return;
    }
    onCommit(info.offset.x > 0 ? "adopt" : "pass");
  }

  const flungX = flingTo === "adopt" ? 700 : flingTo === "pass" ? -700 : 0;

  return (
    <motion.article
      drag="x"
      dragSnapToOrigin
      dragElastic={0.55}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      animate={
        flingTo
          ? { x: flungX, rotate: flingTo === "adopt" ? 22 : -22, opacity: 0 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className="absolute inset-0 cursor-grab touch-pan-y overflow-hidden rounded-[2rem] bg-ink shadow-2xl ring-1 ring-white/20 active:cursor-grabbing"
      aria-label={`${pet.name}, ${pet.age} old ${pet.breed}`}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 animate-pulse bg-linear-to-br from-punch/40 via-tangerine/30 to-sky/40" />
      )}

      <img
        src={pet.imageUrl}
        alt={`${pet.name}, a ${pet.age} old ${pet.gender} ${pet.breed}`}
        onLoad={() => setImageLoaded(true)}
        draggable={false}
        className="size-full object-cover select-none"
      />

      {/* Scrim: keeps the overlaid name legible without blacking out the photo. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/95 via-ink/55 to-transparent" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6">
        <div className="flex items-end gap-3">
          <h2 className="font-heading text-4xl leading-none font-bold text-white">
            {pet.name}
          </h2>
          <span className="pb-0.5 text-xl font-medium text-white/80">
            {pet.age}
          </span>
        </div>

        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-white/85">
          <span aria-hidden="true">{SPECIES_EMOJI[pet.species]}</span>
          <span>{pet.breed}</span>
          <span aria-hidden="true" className="text-white/40">
            ·
          </span>
          <span>{pet.location}</span>
        </p>

        <p className="mt-3 line-clamp-2 text-[0.95rem] leading-snug text-white/75">
          {pet.description}
        </p>
      </div>

      {/* Drag stamps */}
      <motion.span
        style={{ opacity: adoptOpacity }}
        className="stamp pointer-events-none absolute top-6 left-5 rotate-[-14deg] border-mint text-2xl text-mint sm:top-8 sm:left-7 sm:text-3xl"
        aria-hidden="true"
      >
        Adopt
      </motion.span>
      <motion.span
        style={{ opacity: nopeOpacity }}
        className="stamp pointer-events-none absolute top-6 right-5 rotate-[14deg] border-punch text-2xl text-punch sm:top-8 sm:right-7 sm:text-3xl"
        aria-hidden="true"
      >
        Nope
      </motion.span>
    </motion.article>
  );
}
