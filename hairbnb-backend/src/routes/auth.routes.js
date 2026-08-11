import express from 'express'
import User from '../models/User.model.js'
import wrapAsync from '../utils/asyncHandler.js';
import passport from 'passport';

const router = express.Router();


// SETTING UP A NEW USER
router.get('/signup',  (req, res)=>{
    res.render('signup.ejs');
})

router.post('/signup', wrapAsync(async (req, res)=>{
    
    try {
        const {username, email, password} = req.body;

    const user = new User({
        username: username,
        email: email
    });

    const registeredUser = await User.register(user,password);

    // Log the user in after successful registration
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to HairBnB!');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
}))

// Logging an existing user
 router.get('/login', wrapAsync( async(req, res)=>{
    res.render('login.ejs');
 }));

 router.post(
    '/login',
    passport.authenticate('local',{
        failureRedirect: '/login',
        failureFlash: true
    }
    ),
     wrapAsync( async(req, res)=>{
        console.log(res.locals.currUser);
        res.redirect('/listings');
 }));

// Logout
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out!');
    res.redirect('/listings');
  });
});

// Start Google authentication
router.get(
    "/auth/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);

// Google redirects here after authentication
router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login"
    }),
    (req, res) => {
        res.redirect("/dashboard");
    }
);


export default router;