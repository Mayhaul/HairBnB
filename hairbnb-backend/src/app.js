import express from 'express';
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import session from 'express-session';
import flash from 'connect-flash';
import routes from './routes/index.js'; 
import passport from 'passport'
import LocalStratergy from 'passport-local'
import User from './models/User.model.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.engine("ejs", ejsMate);

// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}))

app.use(flash());

// initializing passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));

// stores user related info in session while the session is valid.
passport.serializeUser(User.serializeUser());

// retrieves the user from the stored info in the session.
passport.deserializeUser(User.deserializeUser());


// Middleware to pass flash messages to all templates automatically
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // Passport sets req.user when logged in
  next();
});

app.get('/',(req,res)=>{
    
    res.redirect("/listings");
})

app.get('/demo', async (req,res)=>{
    let demoUser = new User({
        email: "xyz@example.com",
        username: 'mayhaul'
        })

    const Demo = await User.register(demoUser,'1234');

    res.send(Demo);
})



app.use('/',routes);

export default app;
