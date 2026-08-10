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
    const {username, email, password} = req.body;

    const user = new User({
        username: username,
        email: email
    });

    await User.register(user,password);

    res.redirect('/');
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
        res.send('Hello ji')
 }));


export default router;