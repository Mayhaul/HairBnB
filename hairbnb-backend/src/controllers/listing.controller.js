import Listing from '../models/listing.model.js'
import Review from "../models/review.model.js";
import apiError from "../utils/api.error.js";

// Get new listing form.
export const getNewListingForm = async(req, res) => {
    res.render('form.ejs');
}

// Post new listing.
export const postNewListingForm = async (req, res) => {
    let user = req.user._id;

    const listingObj = {user, image: req.file.path, ...req.body };
    console.log(listingObj);

    await Listing.create(listingObj);
    console.log("submitted");
    

    // flash message
    req.flash('success', 'New listing created successfully');
    res.redirect('/listings');
}

// Show listings page.
export const getListingsPage = async (req, res) => {
    const listings = await Listing.find({}).populate('user');
    res.render("listings.ejs", { listings });
}

// open selected listing.
export const getListing = async (req, res) => {
    const ad = await Listing.findById(req.params.id).populate('user');
    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }

    const review = await Review.find({listing: req.params.id}).populate('user');
    const user = req.user;
    res.render("ad.ejs", { ad, review, mapApiKey: process.env.MAP_API_KEY});
}


// Edit listing.
export const editListing = async (req, res) => {
    const id = req.params.id;
    const ad = req.listing;

    if(!ad){
        throw new apiError(404,'Listing Not Found');
    }
    
    res.render("editForm.ejs", { ad });
    console.log(ad);
}

// Post edited listing.
export const postEditedListing = async (req, res) => {
    const id  = req.listing._id;
    const listingObj = {user: req.user._id, ...req.body }; 
    const listing = await Listing.findByIdAndUpdate(id, listingObj);

    if(typeof req.file !== "undefined"){
        listing.image = req.file.path;
    }

    // flash message
    req.flash('success', 'updated successfully');

    res.redirect(`/listings/${id}`); 
}

// Delete Listing.
export const deleteListing =async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);

    // flash message
    req.flash('success', 'Deleted successfully');

    res.redirect('/listings');
}