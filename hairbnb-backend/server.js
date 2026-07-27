import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

// Before we start the server we shall make a connection 
// with the database to avoid db realted errors ahead.
connectDB().then(()=>{
    app.listen(process.env.PORT, ()=>{
    console.log(`App is listening at ${process.env.PORT}`);
        })
    }).catch((error)=>{
        console.log(error);
    })
