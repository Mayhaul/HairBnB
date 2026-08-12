import express from "express";
// MUST include mergeParams: true to access req.params.id from the parent mount path
const router = express.Router({ mergeParams: true });

import {authMiddleware, saveRedirectUrl, reviewAuth} from "../middlewares/auth.middleware.js";
import { validateListing, validateReview } from "../middlewares/validation.middleware.js";
import Review from "../models/review.model.js";
import wrapAsync from "../utils/asyncHandler.js";

// Add Review
router.post('/',authMiddleware,validateReview, wrapAsync(async (req, res)=>{

    const id = req.params.id;
    const {rating, comment} = req.body.review;

    // Joi only validates what comes in the req.body.
    // anything that we add later wont be checked by Joi.

    const reviewObject = {listing: id,user: req.user._id, comment, rating};
    // console.log(reviewObject);

    await Review.create(reviewObject);
    res.redirect(`/listings/${id}`);

    
}));

// DELETE Review
router.post('/:reviewId', authMiddleware, reviewAuth, wrapAsync(async (req, res) => {
    const { id , reviewId } = req.params;
    
    console.log(reviewId);
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));

export default router;