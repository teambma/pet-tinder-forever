import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type HealthState = "loading" | "ok" | "error";

/**
 * M0 smoke-test screen: proves Tailwind, shadcn/ui and the Vite → Express
 * `/api` proxy are all wired up. The real UI arrives in M4+.
 */
export default function App() {
  const [health, setHealth] = useState<HealthState>("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/health")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { ok?: boolean }) => {
        if (!cancelled) setHealth(data.ok ? "ok" : "error");
      })
      .catch(() => {
        if (!cancelled) setHealth("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const healthLabel: Record<HealthState, string> = {
    loading: "Checking the API…",
    ok: "API says { ok: true } ✅",
    error: "API unreachable ❌",
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-linear-to-br from-fuchsia-500 via-rose-400 to-amber-300 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 text-center shadow-2xl backdrop-blur">
        <h1 className="text-5xl font-black tracking-tight text-rose-600">
          Pawspot 🐾
        </h1>
        <p className="mt-3 text-lg text-slate-600">
          Swipe right to adopt your next best friend.
        </p>
        <p className="mt-6 text-sm font-medium text-slate-500">
          {healthLabel[health]}
        </p>
        <Button className="mt-6 w-full rounded-full text-base" size="lg">
          Let&apos;s go
        </Button>
      </div>
    </main>
  );
}
