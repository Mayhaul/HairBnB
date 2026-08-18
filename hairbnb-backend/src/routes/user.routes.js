import express from "express";
const router = express.Router({ mergeParams: true });

import { accountAuth } from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/asyncHandler.js";
import Listing from "../models/Listing.model.js"
import Review from "../models/Review.model.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import Users from "../models/User.model.js";
import passport from 'passport';

// U can see anyone's account.
router.get('/', authMiddleware ,wrapAsync(async (req, res)=>{
    const userId = req.params.user;
    const user = await Users.findById(userId);
    const Reviews = await Review.find({user: userId});
    const Listings = await Listing.find({user: userId});

    // console.log(req.params);
    res.render('profile.ejs', {user, Reviews, Listings});
}));



router.get('/delete', authMiddleware, accountAuth, wrapAsync( async (req, res)=>{
    const userId = req.params.user;
    const user = await Users.findById(userId);

    res.render('deleteUser.ejs', {user});
}));

router.post('/delete', authMiddleware, accountAuth, wrapAsync(async (req, res, next) => {
    // 1. Authenticate credentials manually using passport.authenticate callback
    passport.authenticate('local', async (err, user, info) => {
        if (err) return next(err);

        // If credentials don't match, flash error & redirect back
        if (!user) {
            req.flash('error', info ? info.message : 'Invalid username or password.');
            return res.redirect(`/profile/${req.user._id}/delete`);
        }

        // 3. Delete the user document
        await Users.findByIdAndDelete(req.params.user);

        // 4. Log out & destroy session
        req.logout((logoutErr) => {
            if (logoutErr) return next(logoutErr);
            req.flash('success', 'Your account has been permanently deleted.');
            res.redirect('/Listings');
        });

    })(req, res, next); // <-- Don't forget to invoke the middleware here!
}));   

export default router;