import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { pool } from './config/db';
import membershipLevelsRouter from './routes/membershipLevels';

const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('hello world')
})

app.use("/api/membership-levels", membershipLevelsRouter);

app.get('/api/health', async (_req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT name, tier FROM membership_levels ORDER BY tier'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Databasen svarar inte' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});