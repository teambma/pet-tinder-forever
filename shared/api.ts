import type { Pet, SwipeDirection } from "./pets";

/** `GET /api/pets/next` */
export interface NextPetsResponse {
  pets: Pet[];
  /** Pets left in the deck after the ones returned here. */
  remaining: number;
}

/** `POST /api/swipes` */
export interface SwipeRequest {
  petId: string;
  direction: SwipeDirection;
}

export interface SwipeResponse {
  petId: string;
  direction: SwipeDirection;
}

/** `GET /api/matches` */
export interface MatchesResponse {
  matches: Match[];
}

export interface Match extends Pet {
  /** ISO timestamp of the right-swipe. */
  adoptedAt: string;
}

export interface ApiError {
  error: string;
}
