import { motion } from "motion/react";
import { useState } from "react";
import { AuthDialog, type AuthMode } from "@/components/AuthDialog";
import { Wordmark } from "@/components/Wordmark";
import { Button } from "@/components/ui/button";

const IMAGE_BASE = "https://pets-images.dev-apis.com/pets/";

/** The hero deck: three real adoptable faces, fanned like a hand of cards. */
const HERO_CARDS = [
  { file: "dog4.jpg", name: "Nova", age: "1 year", rotate: -9, x: -34 },
  { file: "cat10.jpg", name: "Nori", age: "3 years", rotate: 5, x: 26 },
  { file: "dog1.jpg", name: "Biscuit", age: "3 years", rotate: -1, x: 0 },
];

const STEPS = [
  { emoji: "👋", title: "Meet them", body: "One face at a time, full screen, no endless list to scroll." },
  { emoji: "💚", title: "Swipe right", body: "Right to adopt, left to pass. That's the whole interface." },
  { emoji: "🏡", title: "Take them home", body: "Every yes lands in your adoptions list, ready to follow up." },
];

export function LandingPage() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);

  return (
    <div className="aurora min-h-dvh text-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Wordmark className="text-2xl sm:text-3xl" />
        <Button
          variant="ghost"
          onClick={() => setAuthMode("signin")}
          className="rounded-full px-5 font-semibold text-cream hover:bg-white/12 hover:text-cream"
        >
          Log in
        </Button>
      </header>

      <main className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-6 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pt-10">
        <div>
          <p className="font-heading text-sm font-semibold tracking-[0.22em] text-marigold uppercase">
            67 animals · 5 species · 0 paperwork
          </p>

          <h1 className="mt-4 font-heading text-5xl leading-[0.95] font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Swipe right.
            <br />
            <span className="text-marigold">Change a life.</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-cream/80">
            Pawspot is dating apps' one good idea, pointed at something that
            matters. Meet adoptable dogs, cats, birds, rabbits and the occasional
            bearded dragon — one photo at a time.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              size="lg"
              onClick={() => setAuthMode("signup")}
              className="h-14 rounded-full bg-punch px-9 text-lg font-bold text-white shadow-[0_10px_30px_-8px_rgba(255,61,127,0.8)] transition hover:translate-y-[-2px] hover:bg-punch/90"
            >
              Start swiping
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setAuthMode("signin")}
              className="h-14 rounded-full border-2 border-cream/35 bg-transparent px-9 text-lg font-bold text-cream hover:border-cream hover:bg-white/10 hover:text-cream"
            >
              I already have an account
            </Button>
          </div>

          <dl className="mt-14 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title}>
                <span className="text-2xl" aria-hidden="true">
                  {step.emoji}
                </span>
                <dt className="mt-2 font-heading text-lg font-semibold">
                  {step.title}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-cream/70">
                  {step.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto flex h-[26rem] w-full max-w-sm items-center justify-center sm:h-[32rem]">
          {HERO_CARDS.map((card, index) => (
            <motion.figure
              key={card.file}
              initial={{ opacity: 0, y: 40, rotate: card.rotate * 2 }}
              animate={{ opacity: 1, y: 0, rotate: card.rotate }}
              transition={{
                delay: index * 0.12,
                type: "spring",
                stiffness: 110,
                damping: 14,
              }}
              style={{ x: card.x, zIndex: index }}
              className="absolute h-[22rem] w-[16rem] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-white/25 sm:h-[27rem] sm:w-[19rem]"
            >
              <img
                src={`${IMAGE_BASE}${card.file}`}
                alt={`${card.name}, ${card.age} old, waiting for adoption`}
                className="size-full object-cover"
                loading={index === HERO_CARDS.length - 1 ? "eager" : "lazy"}
              />
              <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink/90 to-transparent p-5 pt-16">
                <figcaption className="font-heading text-2xl font-bold text-white">
                  {card.name}
                  <span className="ml-2 text-base font-medium text-white/75">
                    {card.age}
                  </span>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </main>

      <AuthDialog mode={authMode} onModeChange={setAuthMode} />
    </div>
  );
}
