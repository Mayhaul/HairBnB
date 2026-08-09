import express from 'express';
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";
import session from 'express-session';
import flash from 'connect-flash';
import routes from './routes/index.js'; 

// ---------------- MIDDLEWARE ----------------
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.engine("ejs", ejsMate);


app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    next();
})

app.get('/',(req,res)=>{
    
    res.redirect("/listings");
})

app.use('/',routes);


export default app;
