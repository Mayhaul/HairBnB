import express from "express";
const router = express.Router();
import wrapAsync from "../utils/asyncHandler.js";
import Listings from "../models/Listing.model.js"
import Reviews from "../models/Review.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Users from "../models/User.model.js";

// U can see anyone's account.
router.get('/:user', authMiddleware ,wrapAsync(async (req, res)=>{
    const userId = req.params.user;
    const user = await Users.findById(userId);
    const reviews = await Reviews.find({user: userId});
    const listings = await Listings.find({user: userId});

    // console.log(req.params);
    res.render('profile.ejs', {user, reviews, listings});
}));


export default router;