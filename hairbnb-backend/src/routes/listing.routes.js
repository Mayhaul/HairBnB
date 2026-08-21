import express from "express";
const router = express.Router();
import multer from "multer";

import storage from "../config/cloudConfig.js";
import { validateListing, validateReview } from "../middlewares/validation.middleware.js";
import wrapAsync from "../utils/asyncHandler.js"; 

import {authMiddleware, reviewAuth, listingAuth} from "../middlewares/auth.middleware.js";

const upload = multer({storage:storage});

// |-------- LISTING CONTROLLERS --------|
import { getNewListingForm, postNewListingForm, getListingsPage, getListing, editListing, postEditedListing, deleteListing } from "../controllers/listing.controller.js";

// New listing form.
router.get('/new', authMiddleware, wrapAsync(getNewListingForm));

// Post listing form.
router.post('/new',authMiddleware, upload.single('image'), validateListing , wrapAsync(postNewListingForm));

// Listings page
router.get('/', wrapAsync(getListingsPage));

// Open listing.
router.get('/:id', wrapAsync(getListing));

// Edit listing
router.get('/:id/edit',authMiddleware, listingAuth, wrapAsync(editListing));

// Post edited listing.
router.post('/:id/edit',authMiddleware, listingAuth, upload.single('image'), validateListing, wrapAsync(postEditedListing));

// Delete
router.post('/:id/delete', authMiddleware, listingAuth, wrapAsync(deleteListing));

export default router;