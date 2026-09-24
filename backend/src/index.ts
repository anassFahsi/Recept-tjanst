import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './db/pool';
import membershipLevelsRouter from './routes/membershipLevels';
import authRouter from './routes/auth';
import recipesRoutes from "./routes/recipes";
import checkoutRouter from './routes/checkout';

const app = express();
app.use(cors());
app.use(express.json());


app.use("/api/recipes", recipesRoutes);
app.use("/api/membership-levels", membershipLevelsRouter); 
app.use('/api/auth', authRouter);
app.use('/api/checkout', checkoutRouter);

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
