import express from 'express';
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import session from 'express-session';
import flash from 'connect-flash';
import routes from './routes/index.js'; 
import passport from 'passport'
import LocalStrategy from 'passport-local'
import User from './models/user.model.js'
import GoogleStrategy from  'passport-google-oauth20'
import dotenv from 'dotenv'
import MongoStore from 'connect-mongo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
// ---------------- MIDDLEWARES ----------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure mongo session store.
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24 * 3600
});


// stores session id in cookies with its hashed signature with secret.
app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
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

// uses the session to figure out which user is logged in.
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Find existing user
                let user = await User.findOne({
                    googleId: profile.id
                });

                // Create user if they don't exist
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        username: profile.displayName,
                        email: profile.emails?.[0]?.value
                    });
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);
// stores user related info in session while the session is valid.
passport.serializeUser(User.serializeUser());

// retrieves the user from the stored info in the session.
passport.deserializeUser(User.deserializeUser());


// Middleware to pass flash messages to all templates automatically
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user; // Passport sets req.user when logged in
//   console.log(req.user);
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

    app.get('/test', (req, res) => {
  console.log('Raw Session:', req.session);
  console.log('Passport User:', req.session.passport);
  res.send('Check server terminal');
});



app.use('/',routes);

export default app;
