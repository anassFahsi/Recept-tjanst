import { Router } from "express";
import { getAllRecipes } from "../controllers/recipesController";

const router = Router();

router.get("/", getAllRecipes);

export default router;
