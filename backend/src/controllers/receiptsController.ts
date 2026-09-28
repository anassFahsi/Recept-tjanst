import { Request, Response } from 'express';
import pool from '../db/pool';

export async function getMyReceipts(
  req: Request,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Du måste vara inloggad' });
    return;
  }

  try {
    const { rows } = await pool.query(
      `SELECT
        id,
        order_reference AS "orderReference",
        amount_ore AS "amountOre",
        level_name_snapshot AS "levelName",
        status,
        paid_at AS "paidAt"
       FROM receipts
       WHERE user_id = $1
       ORDER BY paid_at DESC`,
      [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Failed to fetch receipts:', error);
    res.status(500).json({ error: 'Kunde inte hämta kvitton' });
  }
}
