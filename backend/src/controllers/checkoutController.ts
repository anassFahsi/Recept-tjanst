import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import pool from '../db/pool';

export async function checkout(req: Request, res: Response): Promise<void> {
  const { membershipSlug } = req.body ?? {};

  if (typeof membershipSlug !== 'string') {
    res.status(400).json({ error: 'Ange medlemsnivå' });
    return;
  }

  try {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const { rows } = await client.query(
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
        await client.query('ROLLBACK');
        res.status(404).json({ error: 'Medlemsnivån finns inte' });
        return;
        }

        if (!req.user) {
        await client.query('ROLLBACK');
        res.status(401).json({ error: 'Du måste vara inloggad' });
        return;
        }

        if (membershipLevel.tier <= req.user.tier) {
        await client.query('ROLLBACK');
        res.status(400).json({
            error: 'Du kan bara uppgradera till en högre medlemsnivå',
        });
        return;
        }

        await client.query(
        `UPDATE users
        SET membership_level_id = $1
        WHERE id = $2`,
        [membershipLevel.id, req.user.id]
        );

        const orderReference = randomUUID();

        const receiptResult = await client.query(
        `INSERT INTO receipts (
            user_id,
            membership_level_id,
            order_reference,
            amount_ore,
            level_name_snapshot,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            order_reference AS "orderReference",
            amount_ore AS "amountOre",
            level_name_snapshot AS "levelName",
            status,
            paid_at AS "paidAt"`,
        [
            req.user.id,
            membershipLevel.id,
            orderReference,
            membershipLevel.priceOre,
            membershipLevel.name,
            'paid',
        ]
        );

        await client.query('COMMIT');

        res.json({
        message: 'Medlemskapet har uppgraderats',
        user: {
            ...req.user,
            tier: membershipLevel.tier,
            levelName: membershipLevel.name,
        },
        receipt: receiptResult.rows[0],
        });
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
    } catch (error) {
    console.error('Checkout failed:', error);
    res.status(500).json({ error: 'Checkout misslyckades' });
    }
}