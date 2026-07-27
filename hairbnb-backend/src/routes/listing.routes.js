import express from "express";
const router = express.Router();


// ---------------- MIDDLEWARE ----------------
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



import Listing from '../models/Listing.model.js'

router.get('/form',(req,res)=>{
    res.render('form.ejs');
});

router.post('/submit', async (req, res) => {
    try {
        await Listing.create(req.body);
        console.log("submitted");
        res.redirect('/listings');
    } catch (e) {
        console.error("CREATE ERROR:", e);
        res.status(400).send(`Failed to submit: ${e.message}`);
    }
});



router.get('/',async (req,res)=>{
    const listings = await Listing.find({});
    res.render("listings.ejs", { listings });
    
})

// open the selected listing.
router.get('/:id',async (req,res)=>{
    const ad = await Listing.findById(req.params.id);
    res.render("ad.ejs", {ad});
    console.log(ad);
})


export default router;