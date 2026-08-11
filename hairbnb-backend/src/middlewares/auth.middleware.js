export default function authMiddleware(req, res, next){
    if(!req.isAuthenticated()){
        req.flash('error', '! User must login or Sign up before this action');
        res.redirect('/signup');
    }else{
        next();
    }
}