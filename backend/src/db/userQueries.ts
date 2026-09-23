import pool from './pool';
import { AuthUser } from '../types/user';

export async function findAuthUserById(id: number): Promise<AuthUser | null> {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.display_name, u.role, ml.tier, ml.name AS level_name
     FROM users u
     JOIN membership_levels ml ON ml.id = u.membership_level_id
     WHERE u.id = $1`,
    [id]
  );

  const row = rows[0];
  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role,
    tier: row.tier,
    levelName: row.level_name,
  };
}