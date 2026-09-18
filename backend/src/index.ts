import express from "express";
import cors from "cors";
import pool from "./config/db";
const app = express();
app.use(cors());
app.use(express.json());
import recipesRoutes from "./routes/recipes";
app.use("/recipes", recipesRoutes);




app.get('/recipes',async(req,res)=>{
   // res.send('hello world')
   const result= await pool.query(`SELECT * FROM membership_levels`);
   res.json({result:result.rows});
})

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
