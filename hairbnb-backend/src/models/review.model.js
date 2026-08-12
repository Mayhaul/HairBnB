import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: [true, "Comment is required"]
    },
    rating: {
        type: Number, // Capital 'N'
        min: [0, "Rating must be Min of 0"],
        max: [5, "Rating must be Max of 5"],
    },
    createdAt: {
        type: Date,
        default: Date.now // Pass function reference, don't execute Date.now()
    }
});

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;