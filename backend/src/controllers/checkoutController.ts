import { Request, Response } from 'express';
import pool from '../db/pool';

export async function checkout(req: Request, res: Response): Promise<void> {
  const { membershipSlug } = req.body ?? {};

  if (typeof membershipSlug !== 'string') {
    res.status(400).json({ error: 'Ange medlemsnivå' });
    return;
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        name,
        slug,
        tier,
        price_ore AS "priceOre"
       FROM membership_levels
       WHERE slug = $1`,
      [membershipSlug]
    );

    const membershipLevel = rows[0];

    if (!membershipLevel) {
      res.status(404).json({ error: 'Medlemsnivån finns inte' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: 'Du måste vara inloggad' });
      return;
    }

    if (membershipLevel.tier <= req.user.tier) {
      res.status(400).json({
        error: 'Du kan bara uppgradera till en högre medlemsnivå',
      });
      return;
    }

    res.json({
      message: 'Membership level validated',
      membershipLevel,
      currentTier: req.user.tier,
    });
  } catch (error) {
    console.error('Checkout failed:', error);
    res.status(500).json({ error: 'Checkout misslyckades' });
  }
}