import { ListingSchema } from "../schemas/listing.schema.js"
import { reviewSchema } from "../schemas/review.schema.js";
import apiError from "../utils/ApiError.js";

// Listing Validator Middleware
export const validateListing = (req,res,next) =>{
    let { error } = ListingSchema.validate(req.body);

    if(error){
        const errMsg = error.details.map(el => el.message).join(', ');
        return next( new apiError(400, errMsg));
    }
    next();
}

// Review Validator Middleware
export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map(el => el.message).join(', ');
        return next(new apiError(400, errMsg));
    }
    next(); // Pass to next handler if valid
};