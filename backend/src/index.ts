import express from "express";
import cors from "cors";
import pool from "./db/pool";
import membershipLevelsRouter from "./routes/membershipLevels";

const app = express();
app.use(cors());
app.use(express.json());

import recipesRoutes from "./routes/recipes";
app.use("/api/recipes", recipesRoutes);

app.use("/api/membership-levels", membershipLevelsRouter);






app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});



