import express from "express";
// MUST include mergeParams: true to access req.params.id from the parent mount path
const router = express.Router({ mergeParams: true });

import {authMiddleware, saveRedirectUrl, reviewAuth} from "../middlewares/auth.middleware.js";
import { validateListing, validateReview } from "../middlewares/validation.middleware.js";
import wrapAsync from "../utils/async.handler.js";

// REVIEW CONTROLLERS
import { addReview, deleteReview } from "../controllers/review.controller.js";

// ADD Review
router.post('/',authMiddleware,validateReview, wrapAsync(addReview));

// DELETE Review
router.post('/:reviewId', authMiddleware, reviewAuth, wrapAsync(deleteReview));

export default router;