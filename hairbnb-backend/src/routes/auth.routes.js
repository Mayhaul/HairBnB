import express from 'express'
const router = express.Router();
import passport from 'passport';

// MIDDLEWARES
import wrapAsync from '../utils/asyncHandler.js';
import {authMiddleware, saveRedirectUrl} from '../middlewares/auth.middleware.js'

// CONTROLLERS
import { loginHandler, loginPage, logOutPage, signUpHandler, signUpPage } from '../controllers/auth.controller.js';



// SETTING UP A NEW USER
router.get('/signup',  signUpPage)

// SignUp
router.post('/signup',saveRedirectUrl, wrapAsync(signUpHandler))

// Login page.
 router.get('/login', wrapAsync( loginPage ));

// Login 
 router.post('/login', saveRedirectUrl, passport.authenticate('local',{ failureRedirect: '/login', failureFlash: true }),wrapAsync(loginHandler));

// Logout Page.
router.get('/logout', logOutPage);

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