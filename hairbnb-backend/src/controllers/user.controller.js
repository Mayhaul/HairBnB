import Listing from "../models/listing.model.js"
import Review from "../models/review.model.js";
import Users from "../models/user.model.js";
import passport from 'passport';


// U can see anyone's account.
export const getUser = async (req, res)=>{
    const userId = req.params.user;
    const user = await Users.findById(userId);
    const reviews = await Review.find({ user: userId });
    const listings = await Listing.find({ user: userId });

    res.render("profile.ejs", {
        user,
        reviews,
        listings
    });
    
}

// see delete user page.
export const getDeleteUserPage = async (req, res)=>{
    const userId = req.params.user;
    const user = await Users.findById(userId);

    res.render('deleteUser.ejs', {user});
}

export const postDeleteUser = async (req, res, next) => {
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
}