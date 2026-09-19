import express from "express";
import cors from "cors";
import pool from "./config/db";
const app = express();
app.use(cors());
app.use(express.json());
import recipesRoutes from "./routes/recipes";
app.use("/recipes", recipesRoutes);






app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
