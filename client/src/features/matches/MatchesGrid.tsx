import { AnimatePresence, motion } from "motion/react";
import { Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Match } from "@shared/api";
import { PawLoader } from "@/components/PawLoader";
import { SPECIES_EMOJI } from "@/features/swipe/species";
import { ApiError, api } from "@/lib/api";

type Status = "loading" | "ready" | "error";

export function MatchesGrid() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);

  /** Bumped by the retry button; the fetch effect keys off it. */
  const [fetchToken, setFetchToken] = useState(0);

  useEffect(() => {
    let cancelled = false;

    api
      .matches()
      .then(({ matches: loaded }) => {
        if (cancelled) return;
        setMatches(loaded);
        setStatus("ready");
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setStatus("error");
        setError(
          cause instanceof ApiError
            ? cause.message
            : "Couldn't load your adoptions.",
        );
      });

    return () => {
      cancelled = true;
    };
  }, [fetchToken]);

  async function unadopt(pet: Match) {
    const previous = matches;
    // Optimistic: the tile leaves immediately, restored if the write fails.
    setMatches((current) => current.filter((match) => match.id !== pet.id));
    try {
      await api.unadopt(pet.id);
    } catch {
      setMatches(previous);
      setError(`Couldn't un-adopt ${pet.name}. Try again.`);
    }
  }

  if (status === "loading") {
    return (
      <div className="grid flex-1 place-items-center">
        <PawLoader label="Gathering your adoptions…" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <Panel
        emoji="🙃"
        title="Can't reach your adoptions"
        body={error ?? "Something went wrong on our side."}
      >
        <button
          type="button"
          onClick={() => {
            setStatus("loading");
            setFetchToken((token) => token + 1);
          }}
          className="rounded-full bg-cream px-7 py-3 font-heading font-bold text-ink transition hover:-translate-y-0.5"
        >
          Try again
        </button>
      </Panel>
    );
  }

  if (matches.length === 0) {
    return (
      <Panel
        emoji="💌"
        title="No adoptions yet"
        body="Swipe right on someone and they'll show up here."
      >
        <Link
          to="/app"
          className="rounded-full bg-cream px-7 py-3 font-heading font-bold text-ink transition hover:-translate-y-0.5"
        >
          Back to the deck
        </Link>
      </Panel>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pt-4 pb-16 sm:px-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <h1 className="font-heading text-4xl font-bold text-cream sm:text-5xl">
          Your adoptions
        </h1>
        <span className="rounded-full bg-marigold px-3.5 py-1 font-heading text-sm font-bold text-ink">
          {matches.length} {matches.length === 1 ? "friend" : "friends"}
        </span>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-marigold">
          {error}
        </p>
      )}

      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {matches.map((match) => (
            <motion.li
              key={match.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              className="relative overflow-hidden rounded-3xl bg-ink shadow-lg ring-1 ring-white/15"
            >
              <div className="aspect-[3/4]">
                <img
                  src={match.imageUrl}
                  alt={`${match.name}, a ${match.age} old ${match.breed}`}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>

              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-ink via-ink/70 to-transparent p-4 pt-14">
                <h2 className="font-heading text-xl leading-tight font-bold text-white">
                  {match.name}
                </h2>
                <p className="mt-0.5 text-sm text-white/75">
                  <span aria-hidden="true">{SPECIES_EMOJI[match.species]}</span>{" "}
                  {match.breed}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void unadopt(match)}
                aria-label={`Un-adopt ${match.name}`}
                className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-ink/70 text-cream backdrop-blur-sm transition hover:bg-ink hover:text-punch focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none"
              >
                <Undo2 className="size-5" aria-hidden="true" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

function Panel({
  emoji,
  title,
  body,
  children,
}: {
  emoji: string;
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid flex-1 place-items-center px-5 pb-16">
      <div className="max-w-sm rounded-[2rem] bg-white/10 px-8 py-12 text-center backdrop-blur-sm">
        <span className="text-5xl" aria-hidden="true">
          {emoji}
        </span>
        <h1 className="mt-4 font-heading text-3xl font-bold text-cream">
          {title}
        </h1>
        <p className="mt-3 text-cream/75">{body}</p>
        <div className="mt-7">{children}</div>
      </div>
    </div>
  );
}
