import pool from './pool';

export interface RecipeAccess {
  requiredTier: number;
  requiredLevelName: string;
}

/** Hämtar nivåkraven för ett recept. Cachas inte — det är tre rader i tabellen. */
export async function getLevelByRecipeLevelId(levelId: number): Promise<RecipeAccess | null> {
  const { rows } = await pool.query(
    'SELECT tier, name FROM membership_levels WHERE id = $1',
    [levelId]
  );
  if (!rows[0]) return null;
  return { requiredTier: rows[0].tier, requiredLevelName: rows[0].name };
}