import { LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Wordmark } from "@/components/Wordmark";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth";

export function AppShell() {
  const navigate = useNavigate();
  const { data: session } = useSession();

  async function handleSignOut() {
    await signOut();
    navigate("/", { replace: true });
  }

  return (
    <div className="aurora flex min-h-dvh flex-col text-cream">
      <header className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Wordmark className="text-2xl" />

        <nav className="flex items-center gap-1 rounded-full bg-white/12 p-1 backdrop-blur-sm">
          <ShellTab to="/app" end>
            Deck
          </ShellTab>
          <ShellTab to="/app/matches">Adoptions</ShellTab>
        </nav>

        <button
          type="button"
          onClick={handleSignOut}
          title={session?.user.name ? `Signed in as ${session.user.name}` : undefined}
          className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-cream/80 transition hover:bg-white/12 hover:text-cream focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none"
        >
          <LogOut className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Sign out</span>
          <span className="sr-only sm:hidden">Sign out</span>
        </button>
      </header>

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

function ShellTab({
  to,
  end,
  children,
}: {
  to: string;
  end?: boolean;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        cn(
          "rounded-full px-4 py-1.5 text-sm font-semibold transition focus-visible:ring-2 focus-visible:ring-cream focus-visible:outline-none",
          isActive
            ? "bg-cream text-ink shadow-sm"
            : "text-cream/75 hover:text-cream",
        )
      }
    >
      {children}
    </NavLink>
  );
}
