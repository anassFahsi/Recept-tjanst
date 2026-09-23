export type Role = 'user' | 'admin';

// Det som skickas till frontend och sätts på req.user.
// Innehåller aldrig password_hash.
export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: Role;
  tier: number;
  levelName: string;
}

// Innehållet i JWT:n. Bara id, nivån hämtas alltid färskt från databasen.
export interface TokenPayload {
  userId: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}