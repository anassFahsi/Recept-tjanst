import { Router } from "express";
import { getAllRecipes } from "../controllers/recipesController";
import { getRecipeBySlug } from "../controllers/recipesController";
import { createRecipe } from "../controllers/recipesController";
import { addIngredientToRecipe } from "../controllers/recipesController";

const router = Router();

router.get("/", getAllRecipes);
router.get("/:slug",getRecipeBySlug);
router.post('/', createRecipe);
router.post('/:id/ingredients',addIngredientToRecipe)



export default router;
