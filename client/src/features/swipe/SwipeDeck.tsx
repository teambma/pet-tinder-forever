import { Heart, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Pet, SwipeDirection } from "@shared/pets";
import { PawLoader } from "@/components/PawLoader";
import { PawConfetti } from "@/features/swipe/PawConfetti";
import { PetCard } from "@/features/swipe/PetCard";
import { ApiError, api } from "@/lib/api";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
/** Fetch the next page once the queue drops this low. */
const REFILL_AT = 4;
/** Matches the card's fly-out spring, so the stack advances as it leaves. */
const FLY_OUT_MS = 260;

type Status = "loading" | "ready" | "error";

export function SwipeDeck() {
  const [queue, setQueue] = useState<Pet[]>([]);
  const [unfetched, setUnfetched] = useState(0);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [flingTo, setFlingTo] = useState<SwipeDirection | null>(null);
  const [dragDirection, setDragDirection] = useState<SwipeDirection | null>(null);
  const [confettiKey, setConfettiKey] = useState(0);
  const [adoptedCount, setAdoptedCount] = useState(0);

  /** Bumped whenever we want another page; the fetch effect keys off it. */
  const [fetchToken, setFetchToken] = useState(0);

  /** Ids already queued, so a refill never re-shows a pet. */
  const seen = useRef(new Set<string>());
  /** Guards against a second swipe landing mid fly-out. */
  const busy = useRef(false);

  useEffect(() => {
    let cancelled = false;

    api
      .nextPets(PAGE_SIZE)
      .then(({ pets, remaining }) => {
        if (cancelled) return;
        const fresh = pets.filter((pet) => !seen.current.has(pet.id));
        for (const pet of fresh) seen.current.add(pet.id);

        setQueue((current) => [...current, ...fresh]);
        setUnfetched(remaining);
        setStatus("ready");
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setStatus("error");
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Couldn't load the deck. Try again.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [fetchToken]);

  const commitSwipe = useCallback(
    (direction: SwipeDirection) => {
      const pet = queue[0];
      if (!pet || busy.current) return;

      busy.current = true;
      setFlingTo(direction);
      setDragDirection(null);

      if (direction === "adopt") {
        setConfettiKey((key) => key + 1);
        setAdoptedCount((count) => count + 1);
      }

      // Optimistic: the card leaves now, the write lands in the background.
      api.swipe(pet.id, direction).catch(() => {
        setError("That swipe didn't save. Check your connection.");
      });

      window.setTimeout(() => {
        setQueue((current) => {
          const next = current.slice(1);
          // Top up from the swipe itself rather than from an effect — this is
          // the event that actually drains the queue.
          if (next.length <= REFILL_AT && unfetched > 0) {
            setFetchToken((token) => token + 1);
          }
          return next;
        });
        setFlingTo(null);
        busy.current = false;
      }, FLY_OUT_MS);
    },
    [queue, unfetched],
  );

  // Desktop keyboard control.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        commitSwipe("pass");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        commitSwipe("adopt");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [commitSwipe]);

  function retry() {
    setStatus("loading");
    setFetchToken((token) => token + 1);
  }

  if (status === "loading") {
    return (
      <DeckFrame>
        <PawLoader label="Rounding up the animals…" />
      </DeckFrame>
    );
  }

  if (status === "error") {
    return (
      <DeckFrame>
        <EmptyPanel
          emoji="🙃"
          title="The deck won't load"
          body={error ?? "Something went wrong on our side."}
          action={
            <DeckButton onClick={retry}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Try again
            </DeckButton>
          }
        />
      </DeckFrame>
    );
  }

  const [top, next] = queue;

  if (!top) {
    return (
      <DeckFrame>
        <EmptyPanel
          emoji="🐾"
          title="You've met everyone!"
          body={
            adoptedCount > 0
              ? `That's every animal on Pawspot. You said yes to ${adoptedCount} of them.`
              : "That's every animal on Pawspot. Un-adopt someone to see them again."
          }
          action={<DeckButton to="/app/matches">See your adoptions</DeckButton>}
        />
      </DeckFrame>
    );
  }

  return (
    <DeckFrame>
      <div className="relative w-full max-w-sm">
        <div className="relative aspect-[3/4.2] w-full">
          {/* The peek of the next card, sitting behind the live one. */}
          {next && (
            <div
              className="absolute inset-0 -z-10 translate-y-3 scale-[0.94] overflow-hidden rounded-[2rem] opacity-70 shadow-xl"
              aria-hidden="true"
            >
              <img
                src={next.imageUrl}
                alt=""
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-ink/25" />
            </div>
          )}

          <PetCard
            key={top.id}
            pet={top}
            flingTo={flingTo}
            onCommit={commitSwipe}
            onDragDirectionChange={setDragDirection}
          />

          <PawConfetti fireKey={confettiKey} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-7">
          <ActionButton
            label={`Pass on ${top.name}`}
            onClick={() => commitSwipe("pass")}
            active={dragDirection === "pass"}
            tone="pass"
          >
            <X className="size-8" strokeWidth={3} aria-hidden="true" />
          </ActionButton>

          <ActionButton
            label={`Adopt ${top.name}`}
            onClick={() => commitSwipe("adopt")}
            active={dragDirection === "adopt"}
            tone="adopt"
          >
            <Heart className="size-8 fill-current" aria-hidden="true" />
          </ActionButton>
        </div>

        <p className="mt-5 text-center text-sm font-medium text-cream/60">
          Drag the card, tap a button, or use{" "}
          <kbd className="rounded-md bg-white/15 px-1.5 py-0.5 font-sans text-cream">
            ←
          </kbd>{" "}
          and{" "}
          <kbd className="rounded-md bg-white/15 px-1.5 py-0.5 font-sans text-cream">
            →
          </kbd>
        </p>

        {error && (
          <p role="alert" className="mt-3 text-center text-sm text-marigold">
            {error}
          </p>
        )}
      </div>
    </DeckFrame>
  );
}

function DeckFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 pb-8">
      {children}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  active,
  tone,
  children,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
  tone: "pass" | "adopt";
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid size-[4.5rem] place-items-center rounded-full bg-cream shadow-xl transition",
        "hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-cream focus-visible:outline-none active:scale-95",
        tone === "pass" ? "text-punch" : "text-mint",
        active && "-translate-y-1 scale-110",
      )}
    >
      {children}
    </button>
  );
}

function EmptyPanel({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string;
  title: string;
  body: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-sm rounded-[2rem] bg-white/10 px-8 py-12 text-center backdrop-blur-sm">
      <span className="text-5xl" aria-hidden="true">
        {emoji}
      </span>
      <h2 className="mt-4 font-heading text-3xl font-bold text-cream">
        {title}
      </h2>
      <p className="mt-3 text-cream/75">{body}</p>
      <div className="mt-7">{action}</div>
    </div>
  );
}

const DECK_BUTTON_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-full bg-cream px-7 py-3 font-heading text-base font-bold text-ink transition hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-cream/60 focus-visible:outline-none";

/** Renders a link when given `to`, otherwise a button. */
function DeckButton({
  children,
  onClick,
  to,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
}) {
  if (to) {
    return (
      <Link to={to} className={DECK_BUTTON_CLASS}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={DECK_BUTTON_CLASS}>
      {children}
    </button>
  );
}
