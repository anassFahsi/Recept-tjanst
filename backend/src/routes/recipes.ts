import { Router } from "express";
import { getAllRecipes } from "../controllers/recipesController";
import { getRecipeBySlug } from "../controllers/recipesController";
import { createRecipe } from "../controllers/recipesController";
import { addIngredientToRecipe } from "../controllers/recipesController";
import { updateRecipe } from "../controllers/recipesController";
import { deleteRecipe } from "../controllers/recipesController";
import { updateIngredient } from "../controllers/recipesController";
import { getIngredientsForRecipe } from "../controllers/recipesController";

const router = Router();

router.get("/", getAllRecipes);
router.get("/:slug",getRecipeBySlug);
router.post('/', createRecipe);
router.post('/:id/ingredients',addIngredientToRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe );
router.put('/:id/ingredients/:ingredientId',updateIngredient);
router.get('/:id/ingredients',getIngredientsForRecipe);
export default router;
