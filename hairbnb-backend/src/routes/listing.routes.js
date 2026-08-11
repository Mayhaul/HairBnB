import express from "express";
const router = express.Router();

import { validateListing, validateReview } from "../middlewares/validation.middleware.js";
import wrapAsync from "../utils/asyncHandler.js"; 
import Listing from '../models/Listing.model.js'
import Review from "../models/review.model.js";
import apiError from "../utils/ApiError.js";


router.get('/form', (req, res) => {
    if(!req.isAuthenticated()){
        req.flash('error', 'User must Login or Sign up before creating a post');
        res.redirect('/signup');
    }
    res.render('form.ejs');
});

router.post('/submit',validateListing, wrapAsync(async (req, res) => {
    await Listing.create(req.body);
    console.log("submitted");
    // flash message
    req.flash('success', 'New listing created successfully');
    res.redirect('/listings');
}));

// listings route
router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find({});
    res.render("listings.ejs", { listings });
}));

// open the selected listing.
router.get('/:id', wrapAsync(async (req, res) => {
    const ad = await Listing.findById(req.params.id);
    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }

    const review = await Review.find({listing: req.params.id});

    res.render("ad.ejs", { ad, review });
    // console.log(ad);
}));

// Edit listing
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const id = req.params.id;
    const ad = await Listing.findById(id);

    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }

    
    res.render("editForm.ejs", { ad });
    console.log(ad);
}));

router.post('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;

    await Listing.findByIdAndUpdate(id, req.body);
    // flash message
    req.flash('success', 'updated successfully');

    res.redirect(`/listings/${id}`); 
}));


// Delete
router.post('/:id/delete', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    // flash message
    req.flash('success', 'Deleted successfully');

    res.redirect('/listings');
}));



export default router;