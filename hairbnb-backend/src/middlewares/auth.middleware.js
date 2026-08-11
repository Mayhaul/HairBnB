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