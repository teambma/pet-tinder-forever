import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth";

export type AuthMode = "signup" | "signin";

const COPY = {
  signup: {
    title: "Start swiping",
    description: "One account, sixty-seven animals hoping you say yes.",
    submit: "Create account",
    switch: "Already have an account?",
    switchAction: "Log in",
  },
  signin: {
    title: "Welcome back",
    description: "Your adoptions are exactly where you left them.",
    submit: "Log in",
    switch: "New to Pawspot?",
    switchAction: "Sign up",
  },
} as const;

interface AuthDialogProps {
  mode: AuthMode | null;
  onModeChange: (mode: AuthMode | null) => void;
}

export function AuthDialog({ mode, onModeChange }: AuthDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const copy = COPY[mode ?? "signup"];
  const isSignup = mode === "signup";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = isSignup
      ? await signUp.email({ name: name.trim(), email: email.trim(), password })
      : await signIn.email({ email: email.trim(), password });

    setSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "That didn't work. Try again.");
      return;
    }
    // The session hook picks the change up and routing swaps to the deck.
    onModeChange(null);
  }

  function switchMode() {
    setError(null);
    onModeChange(isSignup ? "signin" : "signup");
  }

  return (
    <Dialog
      open={mode !== null}
      onOpenChange={(open) => {
        if (!open) {
          setError(null);
          onModeChange(null);
        }
      }}
    >
      <DialogContent className="rounded-3xl border-none bg-cream text-ink sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-3xl">
            {copy.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {copy.description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          {isSignup && (
            <Field
              id="name"
              label="Name"
              value={name}
              onChange={setName}
              autoComplete="name"
              placeholder="Alex"
              required
            />
          )}
          <Field
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            placeholder="you@example.com"
            required
          />
          <Field
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete={isSignup ? "new-password" : "current-password"}
            placeholder={isSignup ? "At least 8 characters" : "••••••••"}
            minLength={8}
            required
          />

          {error && (
            <p
              role="alert"
              className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-punch text-base font-bold text-white hover:bg-punch/90"
          >
            {submitting ? "One moment…" : copy.submit}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {copy.switch}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-semibold text-punch underline underline-offset-4"
          >
            {copy.switchAction}
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}

interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
}

function Field({ id, label, value, onChange, ...rest }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-semibold">
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 rounded-2xl border-input bg-white text-base"
        {...rest}
      />
    </div>
  );
}
