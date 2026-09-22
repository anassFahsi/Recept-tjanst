import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db/pool';
import membershipLevelsRouter from './routes/membershipLevels';

const app = express();
app.use(cors());
app.use(express.json());

import recipesRoutes from "./routes/recipes";
app.use("/api/recipes", recipesRoutes);

app.get('/', (_req, res) => {
  res.send('hello world');
});

app.use('/api/membership-levels', membershipLevelsRouter);

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Databasen svarar inte' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
