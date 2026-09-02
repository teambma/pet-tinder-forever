import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import { PawLoader } from "@/components/PawLoader";
import { useSession } from "@/lib/auth";
import { DeckPage } from "@/pages/DeckPage";
import { LandingPage } from "@/pages/LandingPage";
import { MatchesPage } from "@/pages/MatchesPage";

export default function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="aurora grid min-h-dvh place-items-center">
        <PawLoader label="Fetching the good boys and girls…" />
      </div>
    );
  }

  const signedIn = Boolean(session);

  return (
    <Routes>
      <Route
        path="/"
        element={signedIn ? <Navigate to="/app" replace /> : <LandingPage />}
      />
      <Route
        path="/app"
        element={signedIn ? <AppShell /> : <Navigate to="/" replace />}
      >
        <Route index element={<DeckPage />} />
        <Route path="matches" element={<MatchesPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
