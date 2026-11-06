import cors from 'cors';
import express from 'express';
import { openDatabase } from './db.js';
import type { Gym } from './types.js';

const PORT = Number(process.env.PORT ?? 3001);
const db = openDatabase();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

/**
 * List gyms.
 * Pass `?fail=1` to force a 500 — useful for practising error UI. No artificial delay.
 */
app.get('/api/gyms', (req, res) => {
  if (req.query.fail === '1') {
    res.status(500).json({
      error: 'simulated_failure',
      message: 'Forced failure via ?fail=1 for error-state testing.',
    });
    return;
  }

  const gyms = db
    .prepare(
      `SELECT id, name, city, country, latitude, longitude,
              bookings_count, revenue_cents, capacity, member_count,
              utilization, avg_rating
       FROM gyms
       ORDER BY name ASC`,
    )
    .all() as Gym[];

  res.json({ data: gyms, total_count: gyms.length });
});

app.get('/api/gyms/:id', (req, res) => {
  if (req.query.fail === '1') {
    res.status(500).json({
      error: 'simulated_failure',
      message: 'Forced failure via ?fail=1 for error-state testing.',
    });
    return;
  }

  const gym = db
    .prepare(
      `SELECT id, name, city, country, latitude, longitude,
              bookings_count, revenue_cents, capacity, member_count,
              utilization, avg_rating
       FROM gyms
       WHERE id = ?`,
    )
    .get(req.params.id) as Gym | undefined;

  if (!gym) {
    res.status(404).json({
      error: 'not_found',
      message: `Gym ${req.params.id} was not found.`,
    });
    return;
  }

  res.json({ data: gym });
});

app.listen(PORT, () => {
  console.log(`Gym API listening on http://localhost:${PORT}`);
});
