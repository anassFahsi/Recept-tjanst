export type Role = 'user' | 'admin';

export interface AuthUser {
  id: number;
  email: string;
  displayName: string;
  role: Role;
  tier: number;
  levelName: string;
}