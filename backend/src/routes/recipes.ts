import { Router } from "express";
import { getAllRecipes, getPublishedRecipes } from "../controllers/recipesController";
import { getRecipeBySlug } from "../controllers/recipesController";
import { createRecipe } from "../controllers/recipesController";
import { addIngredientToRecipe } from "../controllers/recipesController";
import { updateRecipe } from "../controllers/recipesController";
import { deleteRecipe } from "../controllers/recipesController";
import { updateIngredient } from "../controllers/recipesController";
import { getIngredientsForRecipe } from "../controllers/recipesController";
import { searchRecipes } from "../controllers/recipesController";
import { deleteIngredient } from "../controllers/recipesController";

const router = Router();

router.get("/", getAllRecipes);
router.get('/search', searchRecipes);
router.post('/', createRecipe);
router.post('/:id/ingredients',addIngredientToRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe );
router.put('/:id/ingredients/:ingredientId', updateIngredient);
router.get('/:id/ingredients', getIngredientsForRecipe);
router.get("/:slug",getRecipeBySlug);
router.delete('/:id/ingredients/:ingredientId',deleteIngredient);
router.get('/recipes/public',getPublishedRecipes);


export default router;
