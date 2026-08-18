import express from "express";
const router = express.Router();
import multer from "multer";

import storage from "../config/cloudConfig.js";
import { validateListing, validateReview } from "../middlewares/validation.middleware.js";
import wrapAsync from "../utils/asyncHandler.js"; 
import Listing from '../models/Listing.model.js'
import Review from "../models/review.model.js";
import apiError from "../utils/ApiError.js";
import {authMiddleware, reviewAuth, listingAuth} from "../middlewares/auth.middleware.js";

const upload = multer({storage:storage});


router.get('/form', authMiddleware, (req, res) => {
    res.render('form.ejs');
});


router.post('/submit',authMiddleware, upload.single('image'), validateListing , wrapAsync(async (req, res) => {
    let user = req.user._id;

    const listingObj = {user, image: req.file.path, ...req.body };
    console.log(listingObj);

    await Listing.create(listingObj);
    console.log("submitted");
    

    // flash message
    req.flash('success', 'New listing created successfully');
    res.redirect('/listings');
}));


// listings route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({}).populate('user');
    res.render("listings.ejs", { listings });
}));

// open the selected listing.
router.get('/:id', wrapAsync(async (req, res) => {
    const ad = await Listing.findById(req.params.id).populate('user');
    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }

    const review = await Review.find({listing: req.params.id}).populate('user');
    const user = req.user;
    res.render("ad.ejs", { ad, review });
    // console.log(ad);
}));

// Edit listing
router.get('/:id/edit',authMiddleware, listingAuth, wrapAsync(async (req, res) => {
    const id = req.params.id;
    const ad = req.listing;

    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }
    
    res.render("editForm.ejs", { ad });
    console.log(ad);
}));

router.post('/:id/edit',authMiddleware, listingAuth, upload.single('image'), validateListing, wrapAsync(async (req, res) => {
    const id  = req.listing._id;
    const listingObj = {user: req.user._id, image: req.file.path, ...req.body }; 
    await Listing.findByIdAndUpdate(id, listingObj);
    // flash message
    req.flash('success', 'updated successfully');

    res.redirect(`/listings/${id}`); 
}));


// Delete
router.post('/:id/delete', authMiddleware, listingAuth, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    // flash message
    req.flash('success', 'Deleted successfully');

    res.redirect('/listings');
}));



export default router;