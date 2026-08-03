import { ListingSchema } from "../schemas/listing.schema.js"
import apiError from "../utils/ApiError.js";

export const validateListing = (req,res,next) =>{
    let { error } = ListingSchema.validate(req.body);

    if(error){
        const errMsg = error.details.map(el => el.message).join(', ');
        return next( new apiError(400, error.details.message));
    }
}