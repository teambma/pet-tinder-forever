import type {
  MatchesResponse,
  NextPetsResponse,
  SwipeResponse,
} from "@shared/api";
import type { SwipeDirection } from "@shared/pets";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(path, {
      credentials: "include",
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError("Can't reach Pawspot. Check your connection.", 0);
  }

  if (!response.ok) {
    throw new ApiError(await errorMessage(response), response.status);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: unknown };
    if (typeof body.error === "string") return body.error;
  } catch {
    // Fall through to the generic message.
  }
  return `Request failed (${response.status})`;
}

export const api = {
  nextPets: (limit = 10) =>
    request<NextPetsResponse>(`/api/pets/next?limit=${limit}`),

  swipe: (petId: string, direction: SwipeDirection) =>
    request<SwipeResponse>("/api/swipes", {
      method: "POST",
      body: JSON.stringify({ petId, direction }),
    }),

  matches: () => request<MatchesResponse>("/api/matches"),

  unadopt: (petId: string) =>
    request<void>(`/api/matches/${petId}`, { method: "DELETE" }),
};
