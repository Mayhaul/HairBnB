export  function authMiddleware(req, res, next){
    if(!req.isAuthenticated()){
        // If the request is a POST (e.g. submitting a review), 
        // save the parent listing page URL instead of the POST review endpoint
        if (req.method === 'POST' && req.params.id) {
        req.session.redirectUrl = `/listings/${req.params.id}`;
        } else {
        req.session.redirectUrl = req.originalUrl;
        }

        req.flash('error', '! User must login or Sign up before this action');
        res.redirect('/login');
    }else{
        next();
    }
}

// We need to save the orignal URL in locals because the session
// restarts after the user logs in which makes all the session variables undefined.
export  function saveRedirectUrl(req, res, next){
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next();
}

import Review from '../models/Review.model.js'

// Only review owners can delete the review.
export async function validDeleteReview (req, res, next){
    try{
        // console.log(req.params);
        
        // extracted listing id and review id from the req url.
    const {id , reviewId} = req.params;
    const review = await Review.findById(reviewId); // obtain the review object with the reviewId.

    const user = res.locals.currUser._id; // get user id from stored currUser from local store.
    console.log(user);


    if (!review) {
      req.flash('error', 'Review not found');
      return res.redirect(`/listings/${id}`);
    }

    // Compare the currUser._Id with the user id ref in the review object. 
    if(!review.user.equals(user)){
        req.flash('error', 'You are not the owner of the comment');
        return res.redirect(`/listings/${req.params.id}`);
    }
    else{
        return next();
    }
    } catch(e){
        return next(err);
    }
}