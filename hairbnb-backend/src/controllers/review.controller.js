import Review from "../models/review.model.js";

// Add review.
export const addReview = async (req, res)=>{

    const id = req.params.id;
    const {rating, comment} = req.body.review;

    // Joi only validates what comes in the req.body.
    // anything that we add later wont be checked by Joi.

    const reviewObject = {listing: id,user: req.user._id, comment, rating};
    // console.log(reviewObject);

    await Review.create(reviewObject);
    res.redirect(`/listings/${id}`);

    
}

// Delete review.
export const deleteReview = async (req, res) => {
    const { id , reviewId } = req.params;
    
    console.log(reviewId);
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}