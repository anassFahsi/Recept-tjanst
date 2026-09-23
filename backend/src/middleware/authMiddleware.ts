import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { findAuthUserById } from '../db/userQueries';
import { TokenPayload } from '../types/user';

function readToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7);
}

function verifyToken(token: string): TokenPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET saknas i backend/.env');

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload === 'object' && typeof payload.userId === 'number') {
      return { userId: payload.userId };
    }
    return null;
  } catch {
    return null;
  }
}

// Kräver inloggning. Sätter req.user eller svarar 401.
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const token = readToken(req);
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    res.status(401).json({ error: 'Du måste vara inloggad' });
    return;
  }

  const user = await findAuthUserById(payload.userId);
  if (!user) {
    res.status(401).json({ error: 'Kontot finns inte längre' });
    return;
  }

  req.user = user;
  next();
}

// Kräver admin. Körs alltid efter requireAuth.
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Du måste vara inloggad' });
    return;
  }
  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Endast för administratörer' });
    return;
  }
  next();
}

// Sätter req.user om det finns en giltig token, men släpper igenom ändå.
// Används på receptroutes så att utloggade kan se låsta teasers.
export async function optionalAuth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const token = readToken(req);
  const payload = token ? verifyToken(token) : null;

  if (payload) {
    const user = await findAuthUserById(payload.userId);
    if (user) req.user = user;
  }

  next();
}