import express from 'express';
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import ejsMate from "ejs-mate";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.engine("ejs", ejsMate);

import routes from './routes/index.js'

app.use('/',routes);

app.get('/',(req,res)=>{
    res.redirect("/listings");
})
export default app;
