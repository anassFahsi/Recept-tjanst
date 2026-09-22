import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/pool';
import { findAuthUserById } from '../db/userQueries';
import { TokenPayload } from '../types/user';

function signToken(userId: number): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET saknas i backend/.env');

  const payload: TokenPayload = { userId };
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export async function register(req: Request, res: Response): Promise<void> {
  const { email, password, displayName } = req.body ?? {};

  if (typeof email !== 'string' || !email.includes('@')) {
    res.status(400).json({ error: 'Ange en giltig e-postadress' });
    return;
  }
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) {
    res.status(400).json({ error: 'Lösenordet måste vara 8–72 tecken' });
    return;
  }
  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    res.status(400).json({ error: 'Ange ett namn' });
    return;
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, membership_level_id)
       VALUES ($1, $2, $3, (SELECT id FROM membership_levels WHERE tier = 1))
       RETURNING id`,
      [email.trim().toLowerCase(), passwordHash, displayName.trim().slice(0, 80)]
    );

    const userId: number = rows[0].id;
    const user = await findAuthUserById(userId);

    res.status(201).json({ token: signToken(userId), user });
  } catch (err) {
    if ((err as { code?: string }).code === '23505') {
      res.status(409).json({ error: 'E-postadressen är redan registrerad' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Kunde inte skapa konto' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    res.status(400).json({ error: 'Ange e-post och lösenord' });
    return;
  }

  try {
    const { rows } = await pool.query(
      'SELECT id, password_hash FROM users WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    const row = rows[0];
    const valid = row ? await bcrypt.compare(password, row.password_hash) : false;

    if (!row || !valid) {
      res.status(401).json({ error: 'Fel e-post eller lösenord' });
      return;
    }

    const user = await findAuthUserById(row.id);
    res.json({ token: signToken(row.id), user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunde inte logga in' });
  }
}