import { Router } from "express";
import {
  getAllRecipes,
  getPublishedRecipes,
  getRecipeBySlug,
  getPublicRecipeBySlug,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addIngredientToRecipe,
  updateIngredient,
  getIngredientsForRecipe,
  deleteIngredient,
  searchRecipes,
  saveRecipes,
  getSavedRecipes,
  deleteSavedRecipes,
} from "../controllers/recipesController";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/authMiddleware";

const router = Router();

// Publikt: nivåkontroll via optionalAuth
router.get('/public', optionalAuth, getPublishedRecipes);
router.get('/public/:slug', optionalAuth, getPublicRecipeBySlug);
router.get('/search', optionalAuth, searchRecipes);

//Publikt: nivåkontroll via requireAuth
router.post('/:id/save', requireAuth, saveRecipes);
router.get('/saved', requireAuth, getSavedRecipes);
router.delete('/:id/save', requireAuth, deleteSavedRecipes);

// Admin
router.get('/', requireAuth, requireAdmin, getAllRecipes);
router.get('/:slug', requireAuth, requireAdmin, getRecipeBySlug);
router.post('/', requireAuth, requireAdmin, createRecipe);
router.put('/:id', requireAuth, requireAdmin, updateRecipe);
router.delete('/:id', requireAuth, requireAdmin, deleteRecipe);
router.post('/:id/ingredients', requireAuth, requireAdmin, addIngredientToRecipe);
router.get('/:id/ingredients', requireAuth, requireAdmin, getIngredientsForRecipe);
router.put('/:id/ingredients/:ingredientId', requireAuth, requireAdmin, updateIngredient);
router.delete('/:id/ingredients/:ingredientId', requireAuth, requireAdmin, deleteIngredient);

export default router;