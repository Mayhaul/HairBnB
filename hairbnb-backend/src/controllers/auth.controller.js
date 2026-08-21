import User from '../models/user.model.js'

// SignUP page
export const signUpPage = (req, res)=>{
    res.render('signup.ejs');
}

// Sign UP
export const signUpHandler = async (req, res)=>{
    
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
    res.redirect(res.locals.redirectUrl);
  }
}

// Login page.
export const loginPage = async(req, res)=>{
    res.render('login.ejs');
 }

// loginHandler
export const loginHandler = async(req, res)=>{
        console.log(res.locals.currUser);
        let redirectUrl = res.locals.redirectUrl || '/listings';
        res.redirect(redirectUrl);
 }

// Logout Page.
export const logOutPage = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out!');
    res.redirect('/listings');
  });
}